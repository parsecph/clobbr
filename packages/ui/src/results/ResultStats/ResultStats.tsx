import { useMemo } from 'react';
import { isNumber } from 'lodash-es';
import { Typography } from '@mui/material';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { mathUtils } from '@clobbr/api';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'results/Result/Result';

const { mean, q5, q95, q99, stdDev } = mathUtils;

export const RESULT_STAT_TYPES: {
  [key: string]: string;
} = {
  MEAN: 'Average (Mean)',
  STD_DEV: 'Std. Deviation',
  FIFTH_PERCENTILE: '5th percentile',
  NINETY_FIFTH_PERCENTILE: '95th percentile',
  NINETY_NINTH_PERCENTILE: '99th percentile'
};

export const getResultStats = (result: ClobbrUIResult) => {
  const qualifiedDurations = result.logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration))
    .map((log) => log.metas.duration as number);

  if (!qualifiedDurations.length || qualifiedDurations.length === 1) {
    return null;
  }

  const meanValue = mean(qualifiedDurations);
  const stdDevValue = stdDev(qualifiedDurations);
  const q5Value = q5(qualifiedDurations);
  const q95Value = q95(qualifiedDurations);
  const q99Value = q99(qualifiedDurations);

  return [
    {
      value: formatNumber(meanValue),
      label: RESULT_STAT_TYPES.MEAN,
      colorClass: getDurationColorClass(meanValue)
    },
    {
      value: formatNumber(stdDevValue),
      label: RESULT_STAT_TYPES.STD_DEV,
      colorClass: getDurationColorClass(stdDevValue)
    },
    {
      value: formatNumber(q5Value),
      label: RESULT_STAT_TYPES.FIFTH_PERCENTILE,
      colorClass: getDurationColorClass(q5Value)
    },
    {
      value: formatNumber(q95Value),
      label: RESULT_STAT_TYPES.NINETY_FIFTH_PERCENTILE,
      colorClass: getDurationColorClass(q95Value)
    },
    {
      value: formatNumber(q99Value),
      label: RESULT_STAT_TYPES.NINETY_NINTH_PERCENTILE,
      colorClass: getDurationColorClass(q99Value)
    }
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
