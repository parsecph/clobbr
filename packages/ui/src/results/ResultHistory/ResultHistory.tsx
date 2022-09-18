import { orderBy } from 'lodash-es';
import { GlobalStore } from 'app/globalContext';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { Typography } from '@mui/material';

import { ResultHistoryTable } from './ResultHistoryTable/ResultHistoryTable';
import { ResultHistoryStats } from './ResultHistoryStats/ResultHistoryStats';
import { ResultHistoryChart } from './ResultHistoryChart/ResultHistoryChart';

import {
  EResultHistoryMode,
  HISTORY_MODES
} from 'shared/enums/EResultHistoryMode';

export const ResultHistory = ({
  results,
  mode
}: {
  results: Array<ClobbrUIResult>;
  mode: EResultHistoryMode;
}) => {
  const parallelResults = results.filter((result) => result.parallel);
  const sequentialResults = results.filter((result) => !result.parallel);

  const parallelResultsByIterations = orderBy(
    parallelResults,
    ['startDate'],
    ['desc']
  ).reduce((acc: { [key: string]: Array<ClobbrUIResult> }, result) => {
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
  ).reduce((acc: { [key: string]: Array<ClobbrUIResult> }, result) => {
    const key = result.iterations.toString() as string;
    if (!acc[key]) {
      acc[key] = [result];
    } else {
      acc[key].push(result);
    }
    return acc;
  }, {});

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <div className="flex flex-col gap-12">
          {Object.keys(parallelResultsByIterations).length ? (
            <div>
              <Typography variant="h6" className="pb-4">
                Parallel results
              </Typography>

              <ul className="flex flex-col gap-4">
                {Object.keys(parallelResultsByIterations).map((key) => (
                  <li key={key}>
                    {mode === HISTORY_MODES.SUMMARY ? (
                      <ResultHistoryStats
                        iterations={key}
                        results={parallelResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.TABLE ? (
                      <ResultHistoryTable
                        iterations={key}
                        results={parallelResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.CHART ? (
                      <ResultHistoryChart
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

          {Object.keys(sequentialResultsByIterations).length ? (
            <ul>
              <Typography variant="h6" className="pb-4">
                Sequence results
              </Typography>

              <div className="flex flex-col gap-4">
                {Object.keys(sequentialResultsByIterations).map((key) => (
                  <li key={key}>
                    {mode === HISTORY_MODES.SUMMARY ? (
                      <ResultHistoryStats
                        iterations={key}
                        results={sequentialResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.TABLE ? (
                      <ResultHistoryTable
                        iterations={key}
                        results={sequentialResultsByIterations[key]}
                      />
                    ) : (
                      <></>
                    )}

                    {mode === HISTORY_MODES.CHART ? (
                      <ResultHistoryChart
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
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
