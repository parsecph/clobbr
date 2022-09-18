import clsx from 'clsx';
import { format } from 'date-fns';

import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { Tooltip, Typography } from '@mui/material';

import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'results/Result/Result';

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
        {results.map((result) => (
          <div className="flex gap-2" key={result.id}>
            {result.startDate ? (
              <Tooltip
                title={format(
                  new Date(result.startDate),
                  'dd MMMM yyyy HH:mm:ss'
                )}
              >
                <Typography
                  variant="caption"
                  className="uppercase opacity-50 inline-flex items-center w-20 flex-shrink-0"
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
                gridTemplateColumns: `repeat(${iterations}, 40px)`
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
                    <Tooltip title={log.metas.status || 'Request failed'}>
                      <Typography
                        variant="caption"
                        className="uppercase opacity-50"
                      >
                        Fail
                      </Typography>
                    </Tooltip>
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
