import { orderBy } from 'lodash-es';
import { GlobalStore } from 'app/globalContext';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { useCallback, useEffect, useState } from 'react';

import { Typography } from '@mui/material';

import { ResultHistoryTable } from './ResultHistoryTable/ResultHistoryTable';
import { ResultHistoryStats } from './ResultHistoryStats/ResultHistoryStats';
import { ResultHistoryChart } from './ResultHistoryChart/ResultHistoryChart';
import { ResultHistoryChronological } from './ResultHistoryChronological/ResultHistoryChronological';
import { ResultHistoryResponseList } from './ResultHistoryResponses/ResultHistoryResponseList';

import {
  EResultHistoryMode,
  HISTORY_MODES
} from 'shared/enums/EResultHistoryMode';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

const MAX_RESULTS = 10;

export const ResultHistory = ({
  result,
  mode
}: {
  result: ClobbrUIListItem;
  mode: EResultHistoryMode;
}) => {
  const [historicalResults, setHistoricalResults] = useState<ClobbrUIResult[]>(
    []
  );

  const fetchHistoricalResults = useCallback(async () => {
    const results = await (window as any).electronAPI.getHistoricalResults(
      result.listItemId
    );
    setHistoricalResults(results);
  }, [result.listItemId]);

  useEffect(() => {
    fetchHistoricalResults();
  }, [result.listItemId, fetchHistoricalResults]);

  const results = [...historicalResults, result];

  const parallelResults = results.filter((result) => result.parallel);
  const sequentialResults = results.filter((result) => !result.parallel);

  const parallelResultsByIterations = orderBy(
    parallelResults,
    ['startDate'],
    ['desc']
  )
    .filter(({ iterations }) => !!iterations)
    .reduce((acc: { [key: string]: Array<ClobbrUIResult> }, result) => {
      const key = result.iterations.toString() as string;
      if (!acc[key]) {
        acc[key] = [result];
      } else {
        acc[key].push(result);
      }
      return acc;
    }, {});

  const sequentialResultsByIterations = orderBy(
    sequentialResults,
    ['startDate'],
    ['desc']
  )
    .filter(({ iterations }) => !!iterations)
    .reduce((acc: { [key: string]: Array<ClobbrUIResult> }, result) => {
      const key = result.iterations.toString() as string;
      if (!acc[key]) {
        acc[key] = [result];
      } else {
        acc[key].push(result);
      }
      return acc;
    }, {});

  const splitParallelAndSequence =
    mode !== HISTORY_MODES.CHRONOLOGICAL && mode !== HISTORY_MODES.RESPONSES;

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <div className="flex flex-col gap-12">
          {mode === HISTORY_MODES.CHRONOLOGICAL ? (
            <ResultHistoryChronological maximumResults={20} results={results} />
          ) : (
            <></>
          )}

          {mode === HISTORY_MODES.RESPONSES ? (
            <ResultHistoryResponseList maximumResults={20} results={results} />
          ) : (
            <></>
          )}

          {splitParallelAndSequence &&
          Object.keys(parallelResultsByIterations).length ? (
            <div>
              <Typography variant="h6" className="pb-4">
                Parallel results
              </Typography>

              <ul className="flex flex-col gap-4">
                {Object.keys(parallelResultsByIterations).map((key) => (
                  <li key={key}>
                    {mode === HISTORY_MODES.SUMMARY ? (
                      <ResultHistoryStats
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={parallelResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.TABLE ? (
                      <ResultHistoryTable
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={parallelResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.CHART ? (
                      <ResultHistoryChart
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={parallelResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}

          {splitParallelAndSequence &&
          Object.keys(sequentialResultsByIterations).length ? (
            <ul>
              <Typography variant="h6" className="pb-4">
                Sequence results
              </Typography>

              <div className="flex flex-col gap-4">
                {Object.keys(sequentialResultsByIterations).map((key) => (
                  <li key={key}>
                    {mode === HISTORY_MODES.SUMMARY ? (
                      <ResultHistoryStats
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={sequentialResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.TABLE ? (
                      <ResultHistoryTable
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={sequentialResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.CHART ? (
                      <ResultHistoryChart
                        maximumResults={MAX_RESULTS}
                        iterations={key}
                        results={sequentialResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </div>
            </ul>
          ) : (
            <></>
          )}

          {!Object.keys(parallelResultsByIterations).length &&
          !Object.keys(sequentialResultsByIterations).length ? (
            <Typography variant="h6" className="p-4">
              No history available. Run this again to see history.
            </Typography>
          ) : (
            <></>
          )}
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
