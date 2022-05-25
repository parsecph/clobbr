import { useContext } from 'react';
import { chunk, mean } from 'lodash-es';

import { GlobalStore } from 'App/globalContext';

import {
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryLine
} from 'victory';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { colors } from 'shared/colors';

const MAX_CHART_DATA_POINTS = 100;

export const ResultChart = ({ item }: { item: ClobbrUIResultListItem }) => {
  const globalStore = useContext(GlobalStore);

  const maxDuration = item.latestResult.resultDurations.reduce((acc, cur) => {
    return acc > cur ? acc : cur;
  }, 0);

  const qualifiedDurations = item.latestResult.logs
    .filter((log) => !log.failed)
    .map((log) => log.metas.duration);

  const chartData =
    qualifiedDurations.length > MAX_CHART_DATA_POINTS
      ? chunk(
          qualifiedDurations,
          Math.round(qualifiedDurations.length / MAX_CHART_DATA_POINTS)
        ).reduce((acc, cur) => {
          acc.push(mean(cur));
          return acc;
        }, [])
      : qualifiedDurations;

  return (
    <div>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor={colors.primary.light} />
            <stop offset="25%" stopColor={colors.primary.main} />
            <stop offset="50%" stopColor="#5FB280" />
            <stop offset="75%" stopColor="#3e8b5d" />
            <stop offset="100%" stopColor="#144f2c" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        padding={0}
        height={130}
        minDomain={{ y: 0 }}
        maxDomain={{ y: maxDuration + (maxDuration * 30) / 100 }}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          orientation="right"
          offsetX={30}
          padding={0}
          domainPadding={{ y: 0 }}
          dependentAxis
          tickFormat={(tick) => `${tick}ms`}
          style={{
            grid: {
              stroke: globalStore.themeMode === 'dark' ? 'white' : 'black',
              opacity: 0.001
            },

            tickLabels: {
              fill: globalStore.themeMode === 'dark' ? 'white' : 'black',
              fontSize: 6,
              opacity: 0.15
            },

            axis: {
              stroke: 'none'
            }
          }}
        />

        <VictoryLine
          interpolation="natural"
          style={{
            data: { stroke: 'url(#myGradient)' },
            labels: { fontSize: 12, fill: '#858585' },
            parent: { border: '1px solid #ccc' }
          }}
          animate={{
            duration: 300,
            onEnter: {
              duration: 2000
            }
          }}
          data={chartData.map((duration, index) => {
            return { y: duration, x: index, label: `${duration}ms` };
          })}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea={true}
              pointerLength={4}
              flyoutStyle={{
                fill: 'none',
                stroke: 'none'
              }}
              style={{
                fontSize: 8,
                fill: globalStore.themeMode === 'dark' ? 'white' : 'black',
                boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)'
              }}
            />
          }
        />
      </VictoryChart>
    </div>
  );
};
