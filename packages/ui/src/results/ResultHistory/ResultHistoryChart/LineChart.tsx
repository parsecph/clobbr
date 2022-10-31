import { useRef, useEffect, useState } from 'react';

import chartTrendline from 'chartjs-plugin-trendline';
import type { ChartData, ChartArea } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Decimation
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { colors } from 'shared/colors';
import { formatNumber } from 'shared/util/numberFormat';

ChartJS.register(
  chartTrendline,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  Decimation
);

const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0.1, colors.primary.main);
  gradient.addColorStop(0.5, '#5FB280');
  gradient.addColorStop(0.75, '#3e8b5d');
  gradient.addColorStop(1, '#1f8f4c');

  return gradient;
};

export const LineChart = ({
  data,
  width,
  height,
  responsive,
  hideXAxis,
  hideYAxis,
  suggestedYMax,
  downsampleThreshold,
  numberOfDownSamplePoints
}: {
  data: ChartData<'line' | 'bar'>;
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  suggestedYMax?: number;
  downsampleThreshold?: number;
  numberOfDownSamplePoints?: number;
}) => {
  const chartWidth = width || 300;
  const chartHeight = height || 100;

  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'line' | 'bar'>>({
    datasets: []
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        borderColor: createGradient(chart.ctx, chart.chartArea)
      }))
    };

    setChartData(chartData);
  }, [data]);

  return (
    <Chart
      ref={chartRef}
      options={{
        parsing: false,
        responsive,
        maintainAspectRatio: true,
        scales: {
          ...(hideXAxis
            ? {
                x: {
                  display: false,
                  type: 'linear'
                }
              }
            : {}),
          ...(hideYAxis
            ? {
                y: {
                  display: false,
                  suggestedMin: 50,
                  ...(suggestedYMax ? { suggestedMax: suggestedYMax } : {})
                }
              }
            : {})
        },
        indexAxis: 'x',
        plugins: {
          decimation: {
            enabled: true,
            algorithm: 'lttb',
            samples: numberOfDownSamplePoints || 100,
            threshold: downsampleThreshold || 500
          },
          legend: {
            display: false
          },
          tooltip: {
            usePointStyle: false,
            boxWidth: 0,
            boxHeight: 0,
            bodyFont: {
              size: 16
            },
            caretPadding: 10,
            xAlign: 'center',
            yAlign: 'bottom',
            callbacks: {
              title: (tooltipItem) => {
                return '';
              },
              label: function (context) {
                const label = context.dataset.label || '';
                return context.parsed?.y
                  ? `${formatNumber(context.parsed.y)} ms`
                  : label;
              }
            }
          }
        },
        interaction: {
          intersect: false
        },
        animations: {
          tension: {
            delay: 500,
            duration: 1000,
            easing: 'linear',
            from: 0.5,
            to: 0.3
          }
        } // fancies anim: https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
      }}
      type="line"
      width={chartWidth}
      height={chartHeight}
      data={chartData}
    />
  );
};
