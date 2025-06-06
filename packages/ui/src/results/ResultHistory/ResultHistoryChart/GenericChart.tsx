import { useRef, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useThrottle } from 'react-use';

import chartTrendline from 'chartjs-plugin-trendline';
import type { ChartData, ChartArea, DecimationOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  LineController,
  BarController,
  Tooltip,
  Legend,
  Decimation,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { formatNumber } from 'shared/util/numberFormat';
import { Button } from '@mui/material';

ChartJS.register(
  chartTrendline,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  Decimation,
  Filler
);

const DEFAULT_COLOR_MAP: { [key: number]: string } = {
  0: 'rgba(136,255,184,1.0)',
  1: 'rgba(95,178,128,1.0)',
  2: 'rgba(62,139,93,1.0)',
  3: 'rgba(31,143,76,1.0)',
  4: 'rgba(15,146,59,1.0)',
  5: 'rgba(0,56,18,1.0)'
};

const DEFAULT_BG_COLOR_MAP: { [key: number]: string } = {
  0: 'rgba(136,255,184,0.05)',
  1: 'rgba(136,255,184,0.1)',
  2: 'rgba(136,255,184,0.35)',
  3: 'rgba(136,255,184,1)'
};

const createGradient = (
  ctx: CanvasRenderingContext2D,
  area: ChartArea,
  colorMap: { [key: number]: string }
) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  // Add more color stops for a smoother gradient
  gradient.addColorStop(0.8, colorMap[0]);
  gradient.addColorStop(0.9, colorMap[1]);
  gradient.addColorStop(0.95, colorMap[2]);
  gradient.addColorStop(0.97, colorMap[3]);
  gradient.addColorStop(1, colorMap[4]);

  return gradient;
};

const createBgGradient = (
  ctx: CanvasRenderingContext2D,
  area: ChartArea,
  colorMap: { [key: number]: string }
) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  // Add more color stops for a smoother background gradient
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.2, 'transparent');
  gradient.addColorStop(0.5, colorMap[0]);
  gradient.addColorStop(0.6, colorMap[1]);
  gradient.addColorStop(0.9, colorMap[2]);

  return gradient;
};

const ErrorFallback = ({
  resetErrorBoundary
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="p-4 text-center flex flex-col gap-2" role="alert">
    <p>Something went wrong :-(</p>
    <div>
      <Button size="small" className="text-xs" onClick={resetErrorBoundary}>
        Restore
      </Button>
    </div>
  </div>
);

const THROTTLE_INTERVAL = 250;

export const GenericChart = ({
  data,
  width,
  height,
  responsive,
  hideXAxis,
  hideYAxis,
  suggestedYMax,
  downsampleThreshold = 1000,
  numberOfDownSamplePoints = 1000,
  colorMap,
  bgColorMap,
  xAxisType
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
  colorMap?: { [key: number]: string };
  bgColorMap?: { [key: number]: string };
  xAxisType?: 'category' | 'linear';
}) => {
  const chartWidth = width || 300;
  const chartHeight = height || 100;
  const gradientColorMap = colorMap || DEFAULT_COLOR_MAP;
  const gradientBgColorMap = bgColorMap || DEFAULT_BG_COLOR_MAP;
  const threshold = downsampleThreshold;
  const samples = numberOfDownSamplePoints;
  const scaleXType = xAxisType || 'linear';

  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'line' | 'bar'>>({
    datasets: []
  });

  const throttledData = useThrottle(data, THROTTLE_INTERVAL);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...throttledData,
      datasets: throttledData.datasets.map((dataset) => ({
        ...dataset,
        ...(dataset.type === 'bar'
          ? {
              backgroundColor: createGradient(
                chart.ctx,
                chart.chartArea,
                gradientColorMap
              )
            }
          : {
              borderColor: createGradient(
                chart.ctx,
                chart.chartArea,
                gradientColorMap
              ),
              backgroundColor: createBgGradient(
                chart.ctx,
                chart.chartArea,
                gradientBgColorMap
              ),
              fill: 'origin'
            })
      }))
    };

    setChartData(chartData);
  }, [throttledData, gradientColorMap, gradientBgColorMap]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Chart
        ref={chartRef}
        options={{
          parsing: false,
          responsive,
          maintainAspectRatio: true,
          layout: {
            padding: 0
          },
          scales: {
            ...(hideXAxis
              ? {
                  x: {
                    display: false,
                    ticks: {
                      // Hacks so the chart is full width inside the canvas
                      minRotation: 90,
                      maxTicksLimit: samples + 1,
                      font: {
                        size: 1
                      }
                    },
                    type: scaleXType
                  }
                }
              : {
                  x: {
                    type: scaleXType
                  }
                }),
            ...(hideYAxis
              ? {
                  y: {
                    display: false
                  }
                }
              : {
                  y: {
                    display: true,
                    position: 'right',
                    ticks: {
                      color: 'rgba(160,160,160,0.5)', // Color of the tick labels
                      font: {
                        size: 12, // Font size of the tick labels
                        weight: 'normal'
                      },
                      stepSize: 100
                    },

                    grid: {
                      // display: false,
                      color: 'rgba(160,160,160,0.2)', // Color of the tick labels
                      drawBorder: false,
                      drawOnChartArea: true,
                      borderDash: [3, 3]
                    },
                    title: {
                      display: false
                    },
                    suggestedMin: 50,
                    ...(suggestedYMax ? { suggestedMax: suggestedYMax } : {})
                  }
                })
          },
          indexAxis: 'x',
          plugins: {
            decimation: {
              enabled: true,
              algorithm: 'lttb',
              samples,
              threshold
            } as DecimationOptions,
            legend: {
              display: false
            },
            tooltip: {
              usePointStyle: false,
              boxWidth: 0,
              boxHeight: 0,
              boxPadding: 0,
              borderColor: 'transparent',
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
          }
          // animations:
          //   data.datasets[0].data.length > threshold
          //     ? (false as unknown as any)
          //     : {
          //         opacity: {
          //           delay: 0,
          //           duration: 200,
          //           easing: 'easeInBack', // Use a subtle easing function
          //           from: 0,
          //           to: 1
          //         }
          //       } // fancies anim: https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
        }}
        type="line"
        width={chartWidth}
        height={chartHeight}
        data={chartData}
      />
    </ErrorBoundary>
  );
};
