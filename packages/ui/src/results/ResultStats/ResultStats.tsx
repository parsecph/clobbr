import { useThrottleFn } from 'react-use';
import { Typography } from '@mui/material';
import { isNumber } from 'lodash-es';

import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { getLogStats } from 'shared/util/getLogStats';

export const getResultStats = (result: ClobbrUIResult) => {
  const qualifiedDurations = result.logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration));

  if (!qualifiedDurations.length || qualifiedDurations.length === 1) {
    return null;
  }

  return getLogStats(result.logs, result);
};

export const ResultStats = ({
  result,
  otherStats
}: {
  result: ClobbrUIResult;
  otherStats?: Array<{
    label: string;
    value: string;
    colorClass: string;
  }>;
}) => {
  const stats = useThrottleFn((result) => getResultStats(result), 200, [
    result
  ]);

  if (!stats) {
    return (
      <Typography className="!text-xs text-center opacity-50 p-2">
        No statistics available
      </Typography>
    );
  }

  return (
    <ul
      key={'stats-list'}
      className="grid grid-cols-3 md:flex items-center justify-center gap-4"
    >
      {stats.map(({ label, value, unit }, index) => (
        <li
          key={index}
          className="flex flex-col items-center border-l border-gray-500 border-opacity-20 first:border-0 p-2"
        >
          <Typography variant="body2">
            {value} {unit}
          </Typography>
          <Typography
            variant="caption"
            className="!text-[0.7rem] lg:!text-xs opacity-50"
          >
            {label}
          </Typography>
        </li>
      ))}

      {otherStats ? (
        otherStats.map(({ label, value }, index) => (
          <li
            key={`o${index}`}
            className="flex flex-col items-center border-l border-gray-500 border-opacity-20 first:border-0 p-2"
          >
            <Typography variant="body2">{value}</Typography>
            <Typography variant="caption" className="opacity-50">
              {label}
            </Typography>
          </li>
        ))
      ) : (
        <></>
      )}
    </ul>
  );
};
