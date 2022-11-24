import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { isBoolean } from 'lodash-es';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { GlobalStore } from 'app/globalContext';
import { ButtonBase, Typography, Tooltip } from '@mui/material';
import ShareIcon from '@mui/icons-material/IosShare';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { toEmojiUriComponent } from 'shared/util/emojiUriComponent';

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

  const onShareViewPressed = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowShare(true);
  };

  const onShareClosePressed = () => {
    setShowShare(false);
  };

  const sanitizedItem = useMemo(() => {
    let sizeMap: { [key: string]: number } = {};
    let statusMap: { [key: string]: number } = {};
    let statusCodeMap: { [key: string]: number } = {};

    const { latestResult, url, verb } = item;

    const { iterations, logs, parallel, startDate, endDate } = latestResult;

    const sanitizedLogs = logs.map((log) => {
      const { failed, metas } = log;
      const { duration, index, size, status, statusCode } = metas;

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
        index,
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
      u: url,
      v: verb,
      lr: {
        i: iterations,
        l: sanitizedLogs,
        p: parallel,
        s: startDate,
        e: endDate
      }
    };
  }, [item]);

  useEffect(() => {
    const compressText = async () => {
      try {
        const electronAPI = (window as any).electronAPI;

        if (!electronAPI) {
          // TODO dan handle error
          console.error('electronAPI not found');
          return;
        }

        if (!showShare) {
          return;
        }

        const itemString = JSON.stringify(sanitizedItem);

        const brotliCompressed = await electronAPI.compressText(itemString);

        if (brotliCompressed) {
          setShareUrl(
            `https://share.clobbr.app/share/${toEmojiUriComponent(
              brotliCompressed
            )}
             `
          );
        } else {
          // TODO dan handle error
          // TODO
        }
      } catch (error) {
        console.error(error);
        // TODO dan handle error
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
            containerClassName="h-auto tall-lg:min-h-0"
          >
            <div className="p-4 border-b border-solid border-gray-500 border-opacity-20 flex justify-between items-center">
              <Typography className="flex gap-1" variant="body2">
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
              </Typography>
            </div>

            <div className="p-4">{shareUrl}</div>
          </Modal>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
