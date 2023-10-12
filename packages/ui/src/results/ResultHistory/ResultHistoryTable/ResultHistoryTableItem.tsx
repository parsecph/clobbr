import { useState } from 'react';
import clsx from 'clsx';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';
import { useCopyToClipboard } from 'react-use';

export const ResultHistoryTableItem = ({ log }: { log: ClobbrLogItem }) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const copyLogToClipboard = () => {
    copyToClipboard(JSON.stringify(log, null, 2));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const showCopiedText = state.value && copied;

  if (!log.metas.duration) {
    return <></>;
  }

  return (
    <ButtonBase onClick={copyLogToClipboard} className="w-full">
      <Tooltip title={`Press to copy response #${log.metas.index + 1}`}>
        <Typography
          variant="caption"
          className={clsx(
            getDurationColorClass(log.metas.duration),
            '!font-semibold',
            'tabular-nums'
          )}
        >
          {!state.error && !showCopiedText
            ? formatNumber(log.metas.duration, 0, 0)
            : ''}
          {state.error ? (
            <span className="uppercase text-red-500">Error</span>
          ) : (
            ''
          )}
          {showCopiedText ? (
            <span className="uppercase text-black dark:text-white">Copied</span>
          ) : (
            ''
          )}
        </Typography>
      </Tooltip>
    </ButtonBase>
  );
};
