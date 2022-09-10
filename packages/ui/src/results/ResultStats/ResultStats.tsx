import { useMemo } from 'react';
import { isNumber } from 'lodash-es';
import { Typography } from '@mui/material';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { mathUtils } from '@clobbr/api';
import { formatNumber } from 'shared/util/numberFormat';

const { mean, q5, q95, q99, stdDev } = mathUtils;

export const getResultStats = (result: ClobbrUIResult) => {
  const qualifiedDurations = result.logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration))
    .map((log) => log.metas.duration as number);

  if (!qualifiedDurations.length || qualifiedDurations.length === 1) {
    return null;
  }

  return [
    {
      value: formatNumber(mean(qualifiedDurations)),
      label: 'Average (Mean)'
    },
    {
      value: formatNumber(stdDev(qualifiedDurations)),
      label: 'Standard Deviation'
    },
    { value: formatNumber(q5(qualifiedDurations)), label: '5th percentile' },
    { value: formatNumber(q95(qualifiedDurations)), label: '95th percentile' },
    { value: formatNumber(q99(qualifiedDurations)), label: '99th percentile' }
  ];
};

export const ResultStats = ({ result }: { result: ClobbrUIResult }) => {
  const stats = useMemo(() => getResultStats(result), [result]);

  if (!stats) {
    return <></>;
  }

  return (
    <ul key={'stats-list'} className="flex items-center justify-center gap-4">
      {stats.map(({ label, value }, index) => (
        <li
          key={index}
          className="flex flex-col items-center border-l border-gray-500 border-opacity-20 last:border-0 first:border-0 p-2"
        >
          <Typography variant="body2">{value} ms</Typography>
          <Typography variant="caption" className="opacity-50">
            {label}
          </Typography>
        </li>
      ))}
    </ul>
  );
};
