import { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ButtonBase } from '@mui/material';

import { getResultStats } from 'results/ResultStats/ResultStats';
import { orderBy } from 'lodash-es';
import { ResultHistoryChronologicalItemTitle } from 'results/ResultHistory/ResultHistoryChronological/ResultHistoryChronologicalItemTitle';
import { ResultHistoryResponse } from 'results/ResultHistory/ResultHistoryResponses/ResultHistoryResponse';

export const ResultHistoryResponseList = ({
  results,
  maximumResults
}: {
  results: Array<ClobbrUIResult>;
  maximumResults: number;
}) => {
  const [numberOfResultsToShow, setNumberOfResultsToShow] =
    useState(maximumResults);
  const [openIndexes, setOpenIndexes] = useState<Array<number> | null>([0]);

  const resultsToShow = orderBy(results, 'startDate', 'desc').slice(
    0,
    numberOfResultsToShow
  );
  const someResultsNotShown = results.length > resultsToShow.length;

  const showMoreResults = () => {
    setNumberOfResultsToShow(numberOfResultsToShow + 10);
  };

  const toggleDetails = (index: number) => {
    if (openIndexes?.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...(openIndexes || []), index]);
    }
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
          const detailsOpen = openIndexes?.includes(index) || false;

          return (
            <div key={result.cacheId + index}>
              <ResultHistoryChronologicalItemTitle
                index={index}
                result={result}
                detailsOpen={detailsOpen}
                toggleDetails={() => toggleDetails(index)}
                successPct={successPct}
                expandLabel="Inspect responses"
                collapseLabel="Hide responses"
              />

              <AnimatePresence>
                {detailsOpen ? (
                  <motion.div
                    initial={{ scaleY: 0.9, translateY: -10, opacity: 0.2 }}
                    animate={{
                      translateY: 0,
                      opacity: 1,
                      scaleY: 1
                    }}
                    exit={{ scaleY: 0.9, translateY: 10, opacity: 0 }}
                    transition={{
                      duration: 0.2
                    }}
                    className="ml-8 flex flex-col gap-1"
                  >
                    <ResultHistoryResponse
                      className="mt-4 bg-gray-200 dark:bg-gray-900 rounded-md min-h-[300px] max-h-[60vh] overflow-y-auto overflow-x-hidden"
                      result={result}
                    />
                  </motion.div>
                ) : (
                  ''
                )}
              </AnimatePresence>
            </div>
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
