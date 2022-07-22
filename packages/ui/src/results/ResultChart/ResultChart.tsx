import { useContext, useEffect, useState } from 'react';
import { useMount } from 'react-use';
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
import { formatNumber } from 'shared/util/numberFormat';

const MAX_CHART_DATA_POINTS = 101;

const ENTER_ANIMATION_DURATION_MS = 2000;

const AugmentedLine = VictoryLine as any; // TODO: victory has type issues with style.

export const ResultChart = ({ item }: { item: ClobbrUIResultListItem }) => {
  const globalStore = useContext(GlobalStore);
  const [isInteractive, setIsInteractive] = useState(false);

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

  const maxDuration = chartData.reduce((acc, cur) => {
    return (acc as number) > (cur as number) ? acc : cur;
  }, 0) as number;

  useMount(() => {
    setIsInteractive(false);
  });

  useEffect(() => {
    if (!isInteractive) {
      setTimeout(() => setIsInteractive(true), ENTER_ANIMATION_DURATION_MS);
    }
  }, [isInteractive]);

  return (
    <div className="relative">
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
        minDomain={{ y: -45 }}
        maxDomain={{ y: maxDuration + (maxDuration * 30) / 100 }}
        containerComponent={
          <VictoryVoronoiContainer
            className={!isInteractive ? '!pointer-events-auto' : ''}
          />
        }
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

        <AugmentedLine
          interpolation="natural"
          style={{
            data: { stroke: 'url(#myGradient)' },
            labels: { fontSize: 12, fill: '#858585' },
            parent: { border: '1px solid #ccc' }
          }}
          animate={{
            easing: 'linear',
            duration: 300,
            onEnter: {
              duration: ENTER_ANIMATION_DURATION_MS
            }
          }}
          data={chartData.map((duration, index) => {
            return {
              y: duration,
              x: index,
              label: `${formatNumber(duration as number)}ms`
            };
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
