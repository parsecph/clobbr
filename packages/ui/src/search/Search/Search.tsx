import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/css';
import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { GlobalStore } from 'App/globalContext';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';
import SearchSettings from 'search/SearchSettings/SearchSettings';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { run } from '@clobbr/api';
import { VERBS, Everbs } from 'shared/enums/http';

const DEFAULTS = {
  headers: {},
  data: {}
};

const buttonCss = css`
  && {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
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

const iterationInputCss = css`
  .MuiInputBase-root {
    border-radius: 0;
  }
`;

const verbInputCss = css`
  .MuiInputBase-root {
    border-radius: 0;
  }
`;

const Search = () => {
  const globalStore = useContext(GlobalStore);

  const [running, setRunning] = useState(false);
  const [requestsInProgress, setRequestsInProgress] = useState(false);

  const [runingItemId, setRuningItemId] = useState('');
  const [urlErrorShown, setUrlErrorShown] = useState(false);
  const [autoFocusUrlInput, setAutoFocusUrlInput] = useState(true);

  const toggleUrlError = (nextValue: boolean = true) => {
    setUrlErrorShown(nextValue);
    setAutoFocusUrlInput(nextValue);
  };

  const handleUrlChange =
    (updateUrl: (url: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateUrl(event.target.value);
    };

  const handleIterationChange =
    (updateIterations: (iterations: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.target.value, 10);
      if (!event.target.value || isNaN(numericValue) || numericValue < 0) {
        updateIterations(1);
      } else {
        updateIterations(numericValue);
      }
    };

  const handleVerbChange =
    (updateVerb: (verb: Everbs) => void) =>
    (event: SelectChangeEvent<Everbs>) => {
      updateVerb(event.target.value as Everbs);
    };

  const startRun = async () => {
    const { id } = globalStore.results.addItem({
      url: globalStore.search.url.requestUrl,
      resultDurations: [],
      logs: [],
      averageDuration: 0,
      parallel: globalStore.search.parallel,
      iterations: globalStore.search.iterations,
      verb: globalStore.search.verb
    });

    setRunning(true);
    setRuningItemId(id);
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
   * Run effect.
   */
  useEffect(() => {
    if (requestsInProgress) {
      return;
    }

    if (running) {
      const fireRequests = async () => {
        const configuredOptions = {
          url: globalStore.search.url.requestUrl,
          iterations: globalStore.search.iterations,
          verb: globalStore.search.verb
        };

        const options = { ...DEFAULTS, ...configuredOptions };

        const runEventCallback =
          (itemId: string) =>
          (_event: EEvents, log: ClobbrLogItem, logs: Array<ClobbrLogItem>) => {
            if (!log.metas) {
              console.warn(
                `Skipped log for item [${itemId}] because it has no metas`
              );
            }

            globalStore.results.updateLatestResult({ itemId, logs });
          };

        try {
          const { results, logs, average } = await run(
            globalStore.search.parallel,
            options,
            runEventCallback(runingItemId)
          );

          console.info({ results, logs, average }); // TODO: anything else to update?
          globalStore.results.updateItemEndDate({ itemId: runingItemId });
          setRequestsInProgress(false);
        } catch (error) {
          // TODO dan: toast
          console.error(error);
          setRequestsInProgress(false);
        }
      };

      setRequestsInProgress(true);
      fireRequests();

      setRunning(false);
    }
  }, [
    globalStore.results,
    globalStore.search.url.requestUrl,
    globalStore.search.iterations,
    globalStore.search.parallel,
    globalStore.search.verb,
    running,
    runingItemId,
    requestsInProgress
  ]);

  return (
    <GlobalStore.Consumer>
      {({ search, themeMode }) => (
        <section className="sticky top-4 z-20 flex flex-col items-center justify-center mt-12 mb-6 w-full max-w-xl">
          <motion.div
            animate={{
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 0.3, times: [0, 0.7, 1] }}
            className="flex items-center justify-center w-full"
          >
            <div className="flex-shrink-0 mr-2">
              <Tooltip title={!search.ssl ? 'http' : 'https'}>
                <IconButton
                  aria-label="Toggle ssl (https)"
                  className="w-5 h-5"
                  onClick={search.toggleSsl}
                >
                  {search.ssl ? (
                    <Lock fontSize="small" />
                  ) : (
                    <LockOpen fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </div>

            <TextField
              error={urlErrorShown}
              variant="filled"
              inputRef={(input) =>
                input && autoFocusUrlInput ? input.focus() : null
              }
              onBlur={() => toggleUrlError(false)}
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
                          themeMode === 'light' ? 'text-black' : 'text-gray-300'
                        }
                      >
                        {search.parallel ? <ParallelIcon /> : <SequenceIcon />}
                      </span>
                    </IconButton>
                  </Tooltip>
                )
              }}
            />

            <FormControl
              variant="filled"
              className={clsx(
                'flex-shrink-0',
                leftInputSeparatorCss,
                verbInputCss
              )}
            >
              <InputLabel id="search-verb-label">Verb</InputLabel>
              <Select
                variant="filled"
                labelId="search-verb-label"
                id="search-verb"
                value={search.verb}
                label="Verb"
                onChange={handleVerbChange(search.updateVerb)}
              >
                {Object.keys(VERBS).map((verb: string) => (
                  <MenuItem
                    key={verb}
                    value={(VERBS as { [key: string]: string })[verb]}
                  >
                    <span className="capitalize">{verb.toLowerCase()}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              variant="filled"
              label="Times"
              placeholder="10"
              id="iterations"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={search.iterations}
              onChange={handleIterationChange(search.updateIterations)}
              className={clsx(
                'flex-shrink-0',
                'w-16',
                leftInputSeparatorCss,
                iterationInputCss
              )}
            />

            <Tooltip title={!search.isUrlValid ? 'Type a URL first :-)' : ''}>
              <Button
                variant="contained"
                size="large"
                classes={{ root: buttonCss }}
                className={clsx(
                  'flex-shrink-0 w-24',
                  requestsInProgress ? '!bg-gray-600' : ''
                )}
                style={{ height: '3.5rem' }}
                onClick={search.isUrlValid ? startRun : () => toggleUrlError()}
                disabled={requestsInProgress}
              >
                {requestsInProgress ? <CircularProgress size={20} /> : 'Start'}
              </Button>
            </Tooltip>
          </motion.div>

          <div className="w-full flex justify-center mt-12">
            <SearchSettings />
          </div>
        </section>
      )}
    </GlobalStore.Consumer>
  );
};

export default Search;
