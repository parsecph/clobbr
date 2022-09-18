import { format } from 'date-fns';

import { Tooltip, Typography } from '@mui/material';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { LineChart } from './LineChart';

export const ResultHistoryChart = ({
  results,
  iterations
}: {
  iterations: string;
  results: Array<ClobbrUIResult>;
}) => {
  const iterationNumber = parseInt(iterations, 10);

  if (iterationNumber === 1) {
    return <></>;
  }

  return (
    <div>
      <Typography>
        {iterations} {iterations === '1' ? 'iteration' : 'iterations'}
      </Typography>

      <div className="overflow-auto bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md flex gap-8">
        {results.map((result) => {
          const qualifiedLogs = result.logs.filter((log) => !log.failed);

          const data = {
            labels: qualifiedLogs.map((log) => log.formatted),
            datasets: [
              {
                data: qualifiedLogs.map((log) => log.metas.duration as number),
                cubicInterpolationMode: 'monotone',
                tension: 10,
                elements: {
                  point: {
                    radius: 0
                  }
                }
              }
            ]
          };

          return (
            <div className="flex flex-col gap-3" key={result.id}>
              {result.startDate ? (
                <Tooltip
                  title={format(
                    new Date(result.startDate),
                    'dd MMMM yyyy HH:mm:ss'
                  )}
                >
                  <Typography
                    variant="caption"
                    className="uppercase opacity-50 inline-flex items-center w-20 flex-shrink-0"
                  >
                    {format(new Date(result.startDate), 'dd MMM HH:mm')}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography
                  variant="caption"
                  className="uppercase opacity-50 inline-flex items-center w-20 flex-shrink-0"
                >
                  -
                </Typography>
              )}

              <ul className="flex gap-3 cursor-crosshair">
                <li>
                  <LineChart data={data} />
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
