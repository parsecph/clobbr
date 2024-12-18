import { useState } from 'react';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { ButtonBase } from '@mui/material';

import { ResultHistoryTableFailedItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableFailedItem';
import { ResultHistoryTableItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableItem';

export const ResultHistoryTableLogList = ({
  iterations,
  logs
}: {
  iterations: number;
  logs: Array<ClobbrLogItem>;
}) => {
  const [numberOfLogsToShow, setNumberOfLogsToShow] = useState(100);

  const resultsToShow = logs.slice(0, numberOfLogsToShow);
  const someResultsNotShown = logs.length > resultsToShow.length;

  const showMoreResults = () => {
    setNumberOfLogsToShow(numberOfLogsToShow + 100);
  };

  return (
    <ul
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${resultsToShow.length + 1}, 52px)`
      }}
    >
      {resultsToShow.map((log) => (
        <li key={log.metas.index} className="inline-flex items-center">
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

      {someResultsNotShown ? (
        <li className="hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex flex-shrink-0 w-20 justify-center rounded-md">
          <ButtonBase
            onClick={showMoreResults}
            className="text-xs w-full !p-1.5"
          >
            Show more
          </ButtonBase>
        </li>
      ) : (
        <></>
      )}
    </ul>
  );
};
