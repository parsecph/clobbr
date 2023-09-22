import { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { ResultHistoryTableFailedItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableFailedItem';
import { ResultHistoryTableItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableItem';
import { Ping } from 'shared/components/Ping/Ping';

export const ResultHistoryTable = ({
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
        {resultsToShow.map((result, index) => (
          <div className="flex gap-2 relative" key={result.id}>
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
                gridTemplateColumns: `repeat(${iterations}, 52px)`
              }}
            >
              {result.logs.map((log) => (
                <li key={log.metas.number} className="inline-flex items-center">
                  {log.metas.statusOk && log.metas.duration ? (
                    <ResultHistoryTableItem log={log} />
                  ) : (
                    <></>
                  )}

                  {!log.metas.statusOk ? (
                    <ResultHistoryTableFailedItem log={log} />
                  ) : (
                    <></>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {someResultsNotShown ? (
        <div className="w-full bg-white/20 dark:bg-black/20 hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-b-md">
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
