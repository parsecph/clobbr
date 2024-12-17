import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useMount } from 'react-use';
import clsx from 'clsx';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  forwardRef
} from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/css';
import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  SelectChangeEvent,
  Typography,
  CircularProgress
} from '@mui/material';
import { GlobalStore } from 'app/globalContext';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';
import { ReactComponent as Start } from 'shared/images/search/Start.svg';

import SearchSettings from 'search/SearchSettings/SearchSettings';
import VerbSelect from 'search/Search/VerbSelect';
import IterationsInput from 'search/Search/IterationsInput';

import { Everbs } from 'shared/enums/http';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { WS_EVENTS } from 'shared/consts/wss';

import { useResultRunner } from 'results/useResultRunner';
import { getResultLogsKey } from 'shared/util/getResultLogsKey';
import { getDb } from 'storage/storage';
import { SK } from 'storage/storageKeys';
import { EDbStores } from 'storage/EDbStores';
import { useFetchResults } from 'results/useFetchResults';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

const iterationInputCss = css`
  .MuiInputBase-root {
    border-radius: 0;
  }
`;

const leftInputSeparatorCss = css`
  position: relative;

  &:before {
    content: '';
    display: flex;
    position: absolute;
    width: 0.1rem;
    height: 100%;
    background: rgba(180, 180, 180, 0.3);
  }
`;

const urlInputCss = css`
  .MuiInputBase-root {
    border-top-right-radius: 0;
  }
`;

const verbInputCss = css`
  .MuiInputBase-root {
    border-radius: 0;
  }
`;

const stickySearchCss = css`
  .sticky-search-settings {
    transition: all 0.3s ease-out;
    transition-delay: 1s;
    opacity: 0 !important;
    pointer-events: none;
  }

  &:hover {
    .sticky-search-settings {
      transition: all 0.3s ease-in-out;
      opacity: 1 !important;
      pointer-events: all;
    }
  }
`;

const Search = forwardRef(
  (
    { className }: { className?: string },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const globalStore = useContext(GlobalStore);

    const [wssUrl, setWssUrl] = useState<string>('ws://localhost');

    const getSocketUrl = useCallback((): Promise<string> => {
      return new Promise((resolve) => {
        resolve(wssUrl);
      });
    }, [wssUrl]);

    const { lastMessage, readyState } = useWebSocket(getSocketUrl, {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 1000,
      reconnectInterval: 1000,
      onError: (event) => {
        console.error('Error connecting to ws', event);
      },
      onOpen: (event) => {
        console.info('Connected to ws', event);
      },
      onReconnectStop: (event) => {
        console.info('Stopped reconnecting to ws', event);
      },
      retryOnError: true
    });

    const wsReady = readyState === ReadyState.OPEN;

    const { startRun } = useResultRunner({
      requestUrl: globalStore.search.url.requestUrl,
      parallel: globalStore.search.parallel,
      iterations: globalStore.search.iterations,
      verb: globalStore.search.verb,
      ssl: globalStore.search.ssl,
      dataJson: globalStore.search.data.json,
      properties: globalStore.search.properties,
      headerItems: globalStore.search.headerItems,
      headerInputMode: globalStore.search.headerInputMode,
      headerShellCmd: globalStore.search.headerShellCmd,
      headerNodeScriptData: globalStore.search.headerNodeScriptData,
      timeout: globalStore.search.timeout
    });

    const [urlErrorShown, setUrlErrorShown] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [autoFocusUrlInput, setAutoFocusUrlInput] = useState(true);

    const { fetchResults } = useFetchResults({
      onList: (results: Array<ClobbrUIListItem>) => {
        globalStore.results.setList(results);
      }
    });

    const runEventCallback = useCallback(
      (cacheId: string, listItemId: string) => {
        return (
          _event: EEvents,
          log: ClobbrLogItem,
          logs: Array<ClobbrLogItem>
        ) => {
          if (!log.metas) {
            console.warn(
              `Skipped log for item [${cacheId}] because it has no metas`
            );
          }

          if (logs.length === globalStore.search.plannedIterations) {
            globalStore.search.setInProgress(false);

            // Update the expanded item yet again to bring the user to the latest results in case there has been navigation in the meantime.
            globalStore.results.updateExpandedResults([listItemId]);
          }
        };
      },
      [globalStore.search, globalStore.results]
    );

    const runLogResponseCallback = useCallback(
      async (payload: { cacheId: string; log: ClobbrLogItem }) => {
        const { cacheId, log } = payload;

        const resultDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);

        const id = getResultLogsKey({
          cacheId,
          index: log.metas.index
        });

        await resultDb.setItem(`${SK.RESULT_RESPONSE.ITEM}-${id}`, {
          index: log.metas.index,
          data: log.metas.data,
          error: log.error
        });
      },
      []
    );

    const settingsAnimations = {
      animate:
        inputFocused || globalStore.search.url.requestUrl ? 'shown' : 'hidden',
      whileTap: 'tapped',
      variants: {
        shown: { opacity: 1, transition: { delay: 1 } },
        hidden: { opacity: 0, zIndex: -1, transition: { delay: 3 } },
        tapped: {
          scale: 0.98,
          opacity: 0.5,
          transition: { duration: 0.1 }
        }
      }
    };

    const onUrlFieldBlur = () => {
      setInputFocused(false);
      toggleUrlError(false);
    };

    const toggleUrlError = (nextValue: boolean = true) => {
      setUrlErrorShown(nextValue);
      setAutoFocusUrlInput(nextValue);
    };

    const handleUrlChange =
      (updateUrl: (url: string) => void) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        updateUrl(event.target.value.trim());
      };

    const handleVerbChange =
      (updateVerb: (verb: Everbs) => void) =>
      (event: SelectChangeEvent<Everbs>) => {
        updateVerb(event.target.value as Everbs);
      };

    /**
     * Validation effect.
     */
    useEffect(() => {
      if (globalStore.search.isUrlValid) {
        toggleUrlError(false);
      }
    }, [globalStore.search.isUrlValid]);

    /**
     * Ws effect - used to communicate if electron API is used.
     */
    useEffect(
      () => {
        if (lastMessage?.data) {
          try {
            const message = JSON.parse(lastMessage.data);
            const { event, payload } = message;

            if (process.env.NODE_ENV === 'development') {
              console.info('Received ws message', message);
            }

            if (event.includes(WS_EVENTS.API.RUN_CALLBACK)) {
              runEventCallback(payload.cacheId, payload.listItemId)(
                payload.event,
                payload.log,
                payload.logs
              );
            }

            if (event.includes(WS_EVENTS.API.EMIT_LOG_RESPONSE)) {
              let emitLogPayload: {
                cacheId: string;
                log: ClobbrLogItem;
              } = payload;

              runLogResponseCallback(emitLogPayload);
            }

            if (event.includes(WS_EVENTS.API.START_RUN)) {
              fetchResults();
            }

            if (event.includes(WS_EVENTS.API.END_RUN)) {
              fetchResults();
            }
          } catch (error) {
            console.warn('Skipped ws message, failed to parse JSON');
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [lastMessage]
    );

    useEffect(() => {
      globalStore.search.setWsReady(wsReady);
    }, [globalStore.search, wsReady]);

    useMount(() => {
      try {
        const electronAPI = (window as any).electronAPI;

        if (electronAPI) {
          electronAPI.connectWss();

          electronAPI.onWssUrlSwitch((_event: any, newWsUrl: string) => {
            console.info(`Switching to new ws url: ${newWsUrl}`);
            setWssUrl(newWsUrl);
          });
        }
      } catch (error) {
        console.warn('Failed to connect to wss via backend API', error);
      }
    });

    return (
      <GlobalStore.Consumer>
        {({ search, themeMode, results, appSettings }) => (
          <section
            className={clsx(
              'flex flex-grow flex-shrink flex-col items-center justify-center mt-16 mb-6 w-full max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl',
              appSettings.stickySearch
                ? `sm:sticky top-3 z-110 ${stickySearchCss}`
                : '',
              className
            )}
            ref={ref}
          >
            <motion.div
              animate={{
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 0.3, times: [0, 0.7, 1] }}
              className="flex flex-col flex-shrink-0 items-stretch justify-center w-full px-6 sm:px-4 md:p-0 sm:flex-row sm:items-center"
            >
              <TextField
                error={urlErrorShown}
                variant="filled"
                inputRef={(input) =>
                  input && autoFocusUrlInput ? input.focus() : null
                }
                onFocus={() => setInputFocused(true)}
                onBlur={onUrlFieldBlur}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    startRun();
                  }
                }}
                autoFocus={autoFocusUrlInput}
                label="Type an endpoint (URL) to test"
                placeholder="example.com/api/v1"
                id="search"
                value={search.url.displayText}
                onChange={handleUrlChange(search.updateUrl)}
                className={clsx('flex-grow', urlInputCss)}
                InputProps={{
                  endAdornment: (
                    <Tooltip title={search.parallel ? 'Parallel' : 'Sequence'}>
                      <IconButton
                        className="relative w-10 h-10 before:bg-gray-500 before:bg-opacity-10 before:flex before:w-full before:h-full before:absolute before:rounded-full"
                        aria-label="Toggle between parallel / sequence"
                        onClick={search.toggleParallel}
                      >
                        <span
                          className={
                            themeMode === 'light'
                              ? 'text-black'
                              : 'text-gray-300'
                          }
                        >
                          {search.parallel ? (
                            <ParallelIcon />
                          ) : (
                            <SequenceIcon />
                          )}
                        </span>
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />

              <div className="flex sm:contents">
                <VerbSelect
                  value={search.verb}
                  variant="filled"
                  onVerbChange={handleVerbChange(search.updateVerb)}
                  customContainerClasses={clsx(
                    'flex-shrink-0',
                    'flex-grow',
                    'md:flex-grow-0',
                    leftInputSeparatorCss,
                    verbInputCss
                  )}
                />

                <IterationsInput
                  label="Times"
                  variant="filled"
                  customInputClasses={clsx(
                    'flex-grow',
                    'sm:flex-shrink-0',
                    'sm:w-16',
                    'md:flex-grow-0',
                    leftInputSeparatorCss,
                    iterationInputCss
                  )}
                />

                <Tooltip
                  title={!search.isUrlValid ? 'Type a URL first :-)' : ''}
                >
                  <Button
                    variant="contained"
                    size="large"
                    className={clsx(
                      'flex-shrink-0 flex-grow md:flex-grow-0 !rounded-none sm:!rounded-tr-md sm:!rounded-br-md sm:w-28',
                      search.inProgress ? '!bg-gray-600' : ''
                    )}
                    style={{ height: '3.5rem' }}
                    onClick={
                      search.isUrlValid ? startRun : () => toggleUrlError()
                    }
                    disabled={search.inProgress || !wsReady}
                  >
                    {search.inProgress ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Start'
                    )}
                  </Button>
                </Tooltip>
              </div>
            </motion.div>

            <motion.div
              {...settingsAnimations}
              className={clsx(
                'self-start px-2 sm:p-0 ml-6 md:ml-0',
                appSettings.stickySearch
                  ? 'bg-gray-300/40 dark:bg-gray-600/40 backdrop-blur-sm p-1 rounded-br-md rounded-bl-md sticky-search-settings'
                  : 'mt-2'
              )}
            >
              <div className={'flex gap-1'}>
                <SearchSettings />
              </div>
            </motion.div>

            {results.list.length === 0 ? (
              <motion.div
                className="flex flex-col items-center gap-2 opacity-0"
                animate={{
                  opacity: [0, 0.9, 1]
                }}
                transition={{ duration: 2, delay: 5, times: [0, 0.7, 1] }}
              >
                <Start className="w-full flex-grow-0 flex-shrink-0 max-w-xs py-6 px-12" />

                <Typography variant="body1">
                  <strong className="font-semibold">No results yet</strong>
                </Typography>

                <Typography variant="body2" className="text-center opacity-50">
                  Results will appear here after <br /> you add an endpoint URL
                  and press 'Start'.
                </Typography>
              </motion.div>
            ) : (
              ''
            )}
          </section>
        )}
      </GlobalStore.Consumer>
    );
  }
);

export default Search;
