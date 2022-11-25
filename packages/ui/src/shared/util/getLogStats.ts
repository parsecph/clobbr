import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

import { mathUtils } from '@clobbr/api';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';
import { isNumber } from 'lodash-es';

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

export const getLogStats = (logs: Array<ClobbrLogItem>) => {
  const qualifiedDurations = logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration))
    .map((log) => log.metas.duration as number);

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
