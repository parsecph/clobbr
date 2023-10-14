import clsx from 'clsx';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

import { GenericChart } from '../ResultHistory/ResultHistoryChart/GenericChart';

export const ResultChart = ({
  item,
  showTrendline,
  showBarCharts,
  chartDownSampleThreshold,
  className
}: {
  item: ClobbrUIListItem;
  showTrendline?: boolean;
  showBarCharts?: boolean;
  chartDownSampleThreshold: number;
  className?: string;
}) => {
  const qualifiedLogs = item.latestResult.logs.filter((log) => !log.failed);
  const qualifiedDurations = qualifiedLogs.map(
    (log) => log.metas.duration as number
  );

  const maxDuration = Math.max(...qualifiedDurations);
  const paddedDuration = maxDuration + maxDuration * 0.1 + 100;

  const data = {
    labels: qualifiedLogs.map((log) => {
      return {
        x: log.formatted,
        y: log.formatted
      };
    }),
    datasets: [
      {
        ...(showBarCharts
          ? {
              type: 'bar' as const,
              borderRadius: 5,
              offset: false
            }
          : {}),
        data: qualifiedLogs.map((log, index) => {
          return {
            x: index,
            y: log.metas.duration as number
          };
        }),
        tension: 0.3,
        elements: {
          point: {
            radius: 0
          }
        },
        ...(showTrendline
          ? ({
              trendlineLinear: {
                colorMin: 'grey',
                colorMax: 'grey',
                lineStyle: 'dotted',
                width: 1
              }
            } as {})
          : {})
      }
    ]
  };

  return (
    <div className={clsx('relative cursor-crosshair', className)}>
      <GenericChart
        data={data}
        downsampleThreshold={chartDownSampleThreshold}
        suggestedYMax={paddedDuration}
        responsive={true}
        hideYAxis={true}
        hideXAxis={true}
      />
    </div>
  );
};
