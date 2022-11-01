import clsx from 'clsx';
import { useContext } from 'react';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { GlobalStore } from 'app/globalContext';

import { LineChart } from '../ResultHistory/ResultHistoryChart/LineChart';

export const ResultChart = ({
  item,
  className
}: {
  item: ClobbrUIResultListItem;
  className?: string;
}) => {
  const globalStore = useContext(GlobalStore);

  const qualifiedLogs = item.latestResult.logs.filter((log) => !log.failed);
  const qualifiedDurations = qualifiedLogs.map(
    (log) => log.metas.duration as number
  );

  const maxDuration = Math.max(...qualifiedDurations);
  const paddedDuration = maxDuration + maxDuration * 0.1 + 100;

  const showTrendline = globalStore.appSettings.showTrendline;
  const showBarCharts = globalStore.appSettings.showBarCharts;

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
      <LineChart
        data={data}
        downsampleThreshold={globalStore.appSettings.chartDownSampleThreshold}
        suggestedYMax={paddedDuration}
        responsive={true}
        hideYAxis={true}
        hideXAxis={true}
      />
    </div>
  );
};
