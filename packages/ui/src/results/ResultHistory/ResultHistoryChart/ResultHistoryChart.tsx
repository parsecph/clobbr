import clsx from 'clsx';
import { format } from 'date-fns';

import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { Ping } from 'shared/components/Ping/Ping';
import { GenericChart } from './GenericChart';

import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { useState } from 'react';

export const ResultHistoryChart = ({
  results,
  iterations,
  maximumResults
}: {
  iterations: string;
  results: Array<ClobbrUIResult>;
  maximumResults: number;
}) => {
  const [numberOfResultsToShow, setNumberOfResultsToShow] =
    useState(maximumResults);

  const resultsToShow = results.slice(0, numberOfResultsToShow);
  const someResultsNotShown = results.length > resultsToShow.length;

  const showMoreResults = () => {
    setNumberOfResultsToShow(numberOfResultsToShow + 10);
  };

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
        {resultsToShow.map((result, index) => {
          const qualifiedLogs = result.logs.filter((log) => !log.failed);

          const data = {
            labels: qualifiedLogs.map((log) => {
              return {
                x: log.formatted,
                y: log.formatted
              };
            }),
            datasets: [
              {
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
                }
              }
            ]
          };

          return (
            <div className="flex flex-col gap-3 relative" key={result.id}>
              {index === 0 && results.length > 1 ? (
                <Tooltip title="Latest result">
                  <div className="w-1 h-1 absolute p-2 -left-2.5 -top-1.5">
                    <Ping size={1} />
                  </div>
                </Tooltip>
              ) : (
                <></>
              )}

              {result.startDate ? (
                <Tooltip
                  title={format(
                    new Date(result.startDate),
                    'dd MMMM yyyy HH:mm:ss'
                  )}
                >
                  <Typography
                    variant="caption"
                    className={clsx(
                      'uppercase inline-flex items-center w-20 flex-shrink-0',
                      index === 0 ? 'opacity-100' : 'opacity-50'
                    )}
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
                  <GenericChart
                    data={data}
                    hideXAxis={true}
                    downsampleThreshold={50}
                    numberOfDownSamplePoints={30}
                  />
                </li>
              </ul>
            </div>
          );
        })}

        {someResultsNotShown ? (
          <div className="w-24 shrink-0 bg-white/20 dark:bg-black/20 hover:bg-white/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-md">
            <ButtonBase
              onClick={showMoreResults}
              className="text-xs w-full !p-1.5"
            >
              Show more
            </ButtonBase>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
