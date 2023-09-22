import clsx from 'clsx';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { Tooltip, Typography } from '@mui/material';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';

export const ResultHistoryTableItem = ({ log }: { log: ClobbrLogItem }) => {
  if (!log.metas.duration) {
    return <></>;
  }

  return (
    <Tooltip title={`Response time in ms of request #${log.metas.index + 1}`}>
      <Typography
        variant="caption"
        className={clsx(
          getDurationColorClass(log.metas.duration),
          '!font-semibold',
          'tabular-nums'
        )}
      >
        {formatNumber(log.metas.duration, 0, 0)}
      </Typography>
    </Tooltip>
  );
};
