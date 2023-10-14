import clsx from 'clsx';
import { isNumber } from 'lodash-es';
import { useState } from 'react';
import { Button, ButtonBase, Typography } from '@mui/material';

import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';

import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { ResultHistoryResponseViewer } from 'results/ResultHistory/ResultHistoryResponses/ResultHistoryResponseViewer';
import { getResultLogsKey } from 'shared/util/getResultLogsKey';

export const ResultHistoryResponse = ({
  className,
  result
}: {
  className?: string;
  result: ClobbrUIResult;
}) => {
  const [openLogIndex, setOpenLogIndex] = useState<number | null>(0);
  const [numberOfLogsToShow, setNumberOfLogsToShow] = useState(100);

  const resultsToShow = result.logs.slice(0, numberOfLogsToShow);
  const someResultsNotShown = result.logs.length > resultsToShow.length;

  const showMoreResults = () => {
    setNumberOfLogsToShow(numberOfLogsToShow + 100);
  };

  const updateOpenLogIndex = (index: number) => {
    setOpenLogIndex(index);
  };

  const openLog = isNumber(openLogIndex) ? result.logs[openLogIndex] : null;
  const logKey = getResultLogsKey({
    cachedId: result.cachedId
  });

  return (
    <div className={clsx('flex', className)}>
      <ul className="flex flex-col gap-1 px-6 py-2 flex-shrink-0 overflow-y-auto overflow-x-hidden">
        {resultsToShow.map((log, index) => (
          <li key={log.metas.number} className={clsx('flex')}>
            <Button
              size="small"
              variant="text"
              color="secondary"
              className={clsx(
                'h-8',
                openLogIndex === index ? '!bg-gray-100 dark:!bg-slate-800' : ''
              )}
              onClick={() => updateOpenLogIndex(index)}
            >
              {!log.failed && isNumber(log.metas.duration) ? (
                <span
                  className={clsx(
                    'flex gap-1 font-semibold tabular-nums text-xs'
                  )}
                >
                  <span className="text-black/30 dark:text-white/50">
                    OK in
                  </span>
                  <span className={getDurationColorClass(log.metas.duration)}>
                    {formatNumber(log.metas.duration, 0, 0)}ms
                  </span>
                </span>
              ) : (
                <></>
              )}

              {log.failed ? (
                <span className="text-red-500 !font-semibold tabular-nums text-xs">
                  <span>Fail</span>{' '}
                  {log.metas?.statusCode ? (
                    <span className="border-b border-red-500">
                      {log.metas.statusCode}
                    </span>
                  ) : (
                    <></>
                  )}
                </span>
              ) : (
                <></>
              )}
            </Button>
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

      {openLog ? (
        <ResultHistoryResponseViewer log={openLog} logKey={logKey} />
      ) : (
        <Typography variant="caption" className="text-center p-6">
          Select an item to view the response.
        </Typography>
      )}
    </div>
  );
};
