import { useState } from 'react';
import clsx from 'clsx';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ButtonBase } from '@mui/material';

import { getResultStats } from 'results/ResultStats/ResultStats';
import { orderBy } from 'lodash-es';
import { ResultHistoryChronologicalItem } from 'results/ResultHistory/ResultHistoryChronological/ResultHistoryChronologicalItem';

export const ResultHistoryChronological = ({
  results,
  maximumResults
}: {
  results: Array<ClobbrUIResult>;
  maximumResults: number;
}) => {
  const [numberOfResultsToShow, setNumberOfResultsToShow] =
    useState(maximumResults);

  const resultsToShow = orderBy(results, 'startDate', 'desc').slice(
    0,
    numberOfResultsToShow
  );
  const someResultsNotShown = results.length > resultsToShow.length;

  const showMoreResults = () => {
    setNumberOfResultsToShow(numberOfResultsToShow + 10);
  };

  const chronologicalResultsWithStats = resultsToShow.map((result) => {
    const successfulLogs = result.logs.filter((log) => !log.failed);

    return {
      result,
      successPct: (successfulLogs.length * 100) / result.iterations,
      stats: getResultStats(result) || []
    };
  });

  return (
    <div>
      <div className={clsx('relative flex flex-col gap-4')}>
        {chronologicalResultsWithStats.map(({ result, successPct }, index) => {
          return (
            <ResultHistoryChronologicalItem
              key={result.id}
              index={index}
              result={result}
              successPct={successPct}
            />
          );
        })}
      </div>

      {someResultsNotShown ? (
        <div className="w-full bg-white/20 dark:bg-black/20 hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-md overflow-hidden">
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
