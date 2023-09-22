import clsx from 'clsx';
import { format } from 'date-fns';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { Tooltip, Typography } from '@mui/material';
import { ResultHistoryTableFailedItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableFailedItem';
import { Ping } from 'shared/components/Ping/Ping';

import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';

export const ResultHistoryTable = ({
  results,
  iterations
}: {
  iterations: string;
  results: Array<ClobbrUIResult>;
}) => {
  return (
    <div>
      <Typography>
        {iterations} {iterations === '1' ? 'iteration' : 'iterations'}
      </Typography>

      <div className="overflow-auto bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
        {results.map((result, index) => (
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
                    <Tooltip
                      title={`Response time in ms of request #${
                        log.metas.index + 1
                      }`}
                    >
                      <Typography
                        variant="caption"
                        className={clsx(
                          getDurationColorClass(log.metas.duration),
                          '!font-semibold',
                          'tabular-nums'
                        )}
                      >
                        {formatNumber(log.metas.duration, 0, 0)}
                      </Typography>
                    </Tooltip>
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
    </div>
  );
};
