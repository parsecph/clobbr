import { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { Ping } from 'shared/components/Ping/Ping';

import { getResultStats } from 'results/ResultStats/ResultStats';
import { formatNumber } from 'shared/util/numberFormat';
import { RESULT_STAT_TYPES } from 'shared/util/getLogStats';

export const ResultHistoryStats = ({
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

  const resultsWithStats = resultsToShow.map((result) => {
    const successfulLogs = result.logs.filter((log) => !log.failed);

    return {
      result,
      successPct: (successfulLogs.length * 100) / iterationNumber,
      stats: getResultStats(result) || []
    };
  });

  const getSuccessColorClass = (successPct: number) => {
    if (successPct < 30) {
      return 'text-red-500';
    }

    if (successPct < 50) {
      return 'text-orange-500';
    }

    if (successPct < 95) {
      return 'text-yellow-500';
    }

    return 'text-green-500';
  };

  const numberOfStats = Object.keys(RESULT_STAT_TYPES).length;

  if (iterationNumber === 1) {
    return <></>;
  }

  return (
    <div>
      <Typography>
        {iterations} {iterations === '1' ? 'iteration' : 'iterations'}
      </Typography>

      <div
        className={clsx(
          'overflow-auto bg-gray-100 dark:bg-gray-800 px-3 py-1',
          someResultsNotShown ? 'rounded-t-md' : 'rounded-md'
        )}
      >
        <div className="flex gap-2">
          <Typography
            variant="caption"
            className="uppercase opacity-50 inline-flex items-center w-20 flex-shrink-0"
          >
            -
          </Typography>

          <ul
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${numberOfStats + 1}, 80px)`
            }}
          >
            <li key="successPct" className="inline-flex items-center">
              <Typography variant="caption">Success (%)</Typography>
            </li>

            {Object.keys(RESULT_STAT_TYPES).map((key) => (
              <li key={key} className="inline-flex items-center">
                <Typography variant="caption">
                  {RESULT_STAT_TYPES[key]}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        {resultsWithStats.map(({ result, stats, successPct }, index) => (
          <div className="flex gap-2 relative" key={result.cacheId + index}>
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

            <ul
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${numberOfStats + 1}, 80px)`
              }}
            >
              <li key="success" className="inline-flex items-center">
                <Tooltip title={`${successPct}% of requests that succeeded`}>
                  <Typography
                    variant="caption"
                    className={clsx(
                      '!font-semibold',
                      'tabular-nums',
                      getSuccessColorClass(successPct)
                    )}
                  >
                    {formatNumber(successPct, 0, 1)}%
                  </Typography>
                </Tooltip>
              </li>

              {stats.map(({ value, label, colorClass }, index) => (
                <li key={index} className="inline-flex items-center">
                  <Tooltip title={label}>
                    <Typography
                      variant="caption"
                      className={clsx(
                        colorClass,
                        '!font-semibold',
                        'tabular-nums'
                      )}
                    >
                      {value}
                    </Typography>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {someResultsNotShown ? (
        <div className="w-full bg-white/20 dark:bg-black/20 hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-b-md overflow-hidden">
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
  );
};
