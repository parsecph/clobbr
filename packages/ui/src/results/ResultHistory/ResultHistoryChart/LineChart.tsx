import { useRef, useEffect, useState } from 'react';
import type { ChartData, ChartArea } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { colors } from 'shared/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Tooltip,
  Legend
);

const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0.25, colors.primary.main);
  gradient.addColorStop(0.5, '#5FB280');
  gradient.addColorStop(0.75, '#3e8b5d');
  gradient.addColorStop(1, '#136835');

  return gradient;
};

export const LineChart = ({ data }: { data: ChartData<'bar'> }) => {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
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
        responsive: false,
        maintainAspectRatio: true,
        scales: {
          x: { display: false }
          // y: { display: false }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                return label;
              }
            }
          }
        },
        interaction: {
          intersect: false
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0
          }
        } // fancies anim: https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
      }}
      type="line"
      width={300}
      height={100}
      data={chartData}
    />
  );
};
