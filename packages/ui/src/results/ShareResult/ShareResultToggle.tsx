import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { isBoolean } from 'lodash-es';
import { useCopyToClipboard } from 'react-use';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { ClobbrUICompressedResultListItem } from 'models/ClobbrCompressedResultListItem';
import { GlobalStore } from 'app/globalContext';
import {
  ButtonBase,
  Typography,
  Tooltip,
  TextField,
  Alert,
  Button,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import ShareIcon from '@mui/icons-material/IosShare';
import HelpIcon from '@mui/icons-material/Help';
import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { toEmojiUriComponent } from 'shared/util/emojiUriComponent';
import { VERB_COLOR_CLASS_MAP } from 'shared/enums/VerbsToColorMap';

export const ShareResultToggle = ({
  disabled,
  item,
  className
}: {
  disabled: boolean;
  item: ClobbrUIResultListItem;
  className?: string;
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [compressedCharLength, setCompressedCharLength] = useState(0);
  const [compressionError, setCompressionError] = useState('');
  const [state, copyToClipboard] = useCopyToClipboard();
  const [shareState, setShareState] = useState<{
    value?: string;
    error?: Error;
  }>({
    value: ''
  });
  const [urlRedacted, setUrlRedacted] = useState(false);

  useEffect(() => {
    setShareState(state);
    const resetState = setTimeout(() => {
      setShareState({
        value: ''
      });

      return () => clearTimeout(resetState);
    }, 3000);
  }, [state]);

  const electronLand = useMemo(() => {
    return !!(window as any).electronAPI;
  }, []);

  const onUrlRedactionToggled = (
    newValue: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUrlRedacted(newValue.target.checked);
  };

  const onShareViewPressed = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowShare(true);
  };

  const onShareClosePressed = () => {
    setShowShare(false);
    setShareState({ value: '' });
  };

  const copyShareUrlToClipboard = () => {
    copyToClipboard(shareUrl);
  };

  const openShareUrlAsExternal = () => {
    (window as any).electronAPI.openExternalUrl(shareUrl);
  };

  const sanitizedItem: ClobbrUICompressedResultListItem = useMemo(() => {
    let sizeMap: { [key: string]: number } = {};
    let statusMap: { [key: string]: number } = {};
    let statusCodeMap: { [key: string]: number } = {};

    const { latestResult, url, verb, ssl, properties } = item;

    const { iterations, logs, parallel, startDate, endDate } = latestResult;

    const sanitizedLogs = logs.map((log) => {
      const { failed, metas } = log;
      const { duration, size, status, statusCode } = metas;

      if (size && !sizeMap[size]) {
        sizeMap[size] = Object.keys(sizeMap).length + 1;
      }

      if (status && !statusMap[status]) {
        statusMap[status] = Object.keys(statusMap).length + 1;
      }

      if (statusCode && !statusCodeMap[statusCode]) {
        statusCodeMap[statusCode] = Object.keys(statusCodeMap).length + 1;
      }

      return [
        duration,
        size ? sizeMap[size] : 0,
        status ? statusMap[status] : 0,
        statusCode ? statusCodeMap[statusCode] : 0,
        failed
      ].map((v) => {
        if (v === undefined) {
          return 0;
        }

        if (isBoolean(v)) {
          return Number(v);
        }

        return v;
      });
    });

    return {
      szM: sizeMap,
      stM: statusMap,
      scM: statusCodeMap,
      u: urlRedacted ? '<redacted>' : url,
      v: verb,
      s: ssl,
      ig: properties?.gql?.isGql,
      gql: properties?.gql?.gqlName,
      lr: {
        i: iterations,
        l: sanitizedLogs,
        p: parallel,
        s: startDate,
        e: endDate
      }
    };
  }, [item, urlRedacted]);

  useEffect(() => {
    const compressText = async () => {
      try {
        const electronAPI = (window as any).electronAPI;

        if (!electronAPI) {
          setCompressionError('This feature is currently not active.');
          return;
        }

        if (!showShare) {
          return;
        }

        const itemString = JSON.stringify(sanitizedItem);

        const brotliCompressed = await electronAPI.compressText(itemString);

        if (brotliCompressed) {
          setCompressedCharLength(brotliCompressed.length);
          setShareUrl(
            `https://share.clobbr.app/share/${toEmojiUriComponent(
              brotliCompressed
            )}`
          );
        } else {
          throw new Error('Could not compress text.');
        }
      } catch (error) {
        console.error(error);
        setCompressionError(
          'Oops, failed to generate share link. Try to run the test again and re-share.'
        );
      }
    };

    compressText();
  }, [showShare, sanitizedItem]);

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <div className="contents">
          <div className={clsx(className)}>
            <ButtonBase
              onClick={onShareViewPressed}
              color="primary"
              component="a"
              href="#"
              className="!p-2 shrink-0"
              disabled={disabled}
            >
              <span className="flex items-center justify-center gap-1 text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors text-sm">
                Share <ShareIcon className="!w-5 !h-5 scale-90 -mt-0.5" />
              </span>
            </ButtonBase>
          </div>

          <Modal
            onClose={onShareClosePressed}
            open={showShare}
            maxWidth="xl"
            containerClassName="h-auto tall-lg:!min-h-0"
          >
            <div className="p-4 border-b border-solid border-gray-500 border-opacity-20 flex justify-between items-center">
              <Typography className="flex gap-1 items-center" variant="body2">
                <span className="flex shrink-0 items-center gap-1">
                  <ShareIcon className="!w-6 !h-6" /> Share results of
                </span>

                <span className="flex items-center gap-2 truncate font-semibold">
                  <Tooltip title={item.url}>
                    <span className="truncate">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                  </Tooltip>
                </span>

                {item.properties?.gql?.isGql ? (
                  <>
                    <small
                      className={clsx(
                        'px-2 py-0.5',
                        'rounded-sm text-black',
                        'bg-fuchsia-300'
                      )}
                    >
                      GQL
                    </small>

                    <small
                      className={clsx(
                        'px-2 py-0.5',
                        'rounded-sm text-black',
                        'bg-gray-300'
                      )}
                    >
                      {item.properties?.gql.gqlName}
                    </small>
                  </>
                ) : (
                  <small
                    className={clsx(
                      'px-2 py-0.5',
                      'rounded-sm text-black',
                      VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
                    )}
                  >
                    {item.verb.toUpperCase()}
                  </small>
                )}

                <Tooltip
                  title="Share results securely with your team or friends. All
                    sensitive data will be removed from the results such as
                    headers, payload data, scripts or response content."
                >
                  <HelpIcon className="!w-4 !h-4 opacity-90" />
                </Tooltip>
              </Typography>
            </div>

            <div className="p-4 flex flex-col gap-6">
              {!compressionError ? (
                <>
                  <TextField
                    label="Share link"
                    value={shareUrl}
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    className="w-full"
                  />

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <AppleSwitch
                          onChange={onUrlRedactionToggled}
                          checked={urlRedacted}
                        />
                      }
                      label="Do not share request URL"
                    />
                  </FormGroup>
                </>
              ) : (
                <></>
              )}

              {compressionError ? (
                <div className="flex flex-col items-center">
                  <Alert severity="error">{compressionError}</Alert>
                </div>
              ) : (
                <></>
              )}

              {compressedCharLength > 2048 ? (
                <div className="flex flex-col items-center">
                  <Alert severity="warning">
                    Note: opening the share url might not work in certain
                    browsers due to the large iteration count. If you experience
                    any issues, reduce the iteration count and share again.
                  </Alert>
                </div>
              ) : (
                <></>
              )}

              {!compressionError && shareUrl ? (
                <>
                  <div className="flex gap-2 ">
                    <Button
                      onClick={copyShareUrlToClipboard}
                      className={shareState.value ? 'pointer-events-none' : ''}
                    >
                      {!shareState.error && !shareState.value
                        ? 'Copy to clipboard'
                        : ''}
                      {shareState.error ? 'Failed to copy' : ''}
                      {shareState.value ? 'Copied!' : ''}
                    </Button>

                    {electronLand ? (
                      <Button
                        variant="outlined"
                        href={shareUrl}
                        target="_blank"
                        color={themeMode === 'dark' ? 'primary' : 'secondary'}
                      >
                        Open in browser
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={openShareUrlAsExternal}
                        color={themeMode === 'dark' ? 'primary' : 'secondary'}
                      >
                        Open in browser
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Modal>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
