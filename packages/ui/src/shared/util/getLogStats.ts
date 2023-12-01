import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

import { mathUtils } from '@clobbr/api';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';
import { isNumber } from 'lodash-es';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

const { mean, q5, q95, q99, stdDev } = mathUtils;

export const RESULT_STAT_TYPES: {
  [key: string]: string;
} = {
  MEAN: 'Average (ms)',
  STD_DEV: 'Std. dev (ms)',
  FIFTH_PERCENTILE: 'p5 (ms)',
  NINETY_FIFTH_PERCENTILE: 'p95 (ms)',
  NINETY_NINTH_PERCENTILE: 'p99 (ms)',
  TOTAL_TIME: 'Total time (s)'
};

export const getLogStats = (
  logs: Array<ClobbrLogItem>,
  result: ClobbrUIResult
) => {
  const qualifiedDurations = logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration))
    .map((log) => log.metas.duration as number);

  const startUnixTime = result.startDate
    ? new Date(result.startDate).valueOf()
    : 0;
  const endUnixTime = result.endDate ? new Date(result.endDate).valueOf() : 0;
  const totalDuration = startUnixTime ? endUnixTime - startUnixTime : 0;
  const totalDurationInSeconds = totalDuration / 1000;

  const cumulativeDuration = qualifiedDurations.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const cumulativeDurationInSeconds = cumulativeDuration / 1000;
  const meanValue = mean(qualifiedDurations);
  const stdDevValue = stdDev(qualifiedDurations);
  const q5Value = q5(qualifiedDurations);
  const q95Value = q95(qualifiedDurations);
  const q99Value = q99(qualifiedDurations);

  return [
    {
      value: formatNumber(meanValue),
      unit: 'ms',
      label: RESULT_STAT_TYPES.MEAN,
      colorClass: getDurationColorClass(meanValue)
    },
    {
      value: formatNumber(stdDevValue),
      unit: 'ms',
      label: RESULT_STAT_TYPES.STD_DEV,
      colorClass: getDurationColorClass(stdDevValue)
    },
    {
      value: formatNumber(q5Value),
      unit: 'ms',
      label: RESULT_STAT_TYPES.FIFTH_PERCENTILE,
      colorClass: getDurationColorClass(q5Value)
    },
    {
      value: formatNumber(q95Value),
      unit: 'ms',
      label: RESULT_STAT_TYPES.NINETY_FIFTH_PERCENTILE,
      colorClass: getDurationColorClass(q95Value)
    },
    {
      value: formatNumber(q99Value),
      unit: 'ms',
      label: RESULT_STAT_TYPES.NINETY_NINTH_PERCENTILE,
      colorClass: getDurationColorClass(q99Value)
    },
    {
      value: formatNumber(totalDurationInSeconds, 1),
      unit: 's',
      label: 'Total time',
      colorClass: getDurationColorClass(0) // Always green
    }
  ];
};
