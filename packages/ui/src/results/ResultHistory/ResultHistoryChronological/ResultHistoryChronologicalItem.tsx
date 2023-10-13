import { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';

import { ResultStats } from 'results/ResultStats/ResultStats';
import { formatNumber } from 'shared/util/numberFormat';
import { ResultHistoryTableItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableItem';
import { ResultHistoryTableFailedItem } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableFailedItem';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';
import { ResultHistoryTableLogList } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableLogList';

export const ResultHistoryChronologicalItem = ({
  result,
  successPct,
  index
}: {
  result: ClobbrUIResult;
  successPct: number;
  index: number;
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const config = [
    {
      value: result.parallel ? 'Parallel' : 'Sequence',
      label: `Sent in ${result.parallel ? 'parallel' : 'sequence'}`
    },
    ...(result.timeout
      ? [{ value: `${formatNumber(result.timeout)} ms`, label: 'Timeout' }]
      : []),
    ...(result.headerInputMode === HEADER_MODES.INPUT
      ? [
          {
            value: result.headers?.filter(({ value }) => value).length || 0,
            label: 'Headers'
          }
        ]
      : []),
    ...(result.headerInputMode === HEADER_MODES.NODE_JS
      ? [
          {
            value: 'Node.js generated',
            label: 'Headers'
          }
        ]
      : []),
    ...(result.headerInputMode === HEADER_MODES.SHELL
      ? [
          {
            value: 'Shell generated',
            label: 'Headers'
          }
        ]
      : []),
    ...(result.data
      ? [
          {
            value: `${Object.keys(result.data).length} ${
              Object.keys(result.data).length === 1 ? 'entry' : 'entries'
            }`,
            label: 'Data / Payload'
          }
        ]
      : [])
  ];

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

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

  return (
    <div className="relative flex flex-col gap-2 p-2" key={result.id}>
      <div className="w-px absolute -z-10 h-[calc(100%-1.5rem)] left-5 top-10 bg-gray-500/50" />

      <div className="flex items-center gap-2">
        <Tooltip title={result.parallel ? 'Parallel' : 'Sequence'}>
          <div
            className="flex flex-shrink-0 items-center relative  justify-center w-6 h-6 p-1"
            aria-label={result.parallel ? 'Sequence icon' : 'Parallel icon'}
          >
            <span className="absolute -left-1 -top-1 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-900"></span>

            <span className="absolute w-full h-full rounded-full bg-gray-200/50 darkbg-gray-200 :dark:bg-gray-800/50"></span>

            <span className={'relative z-10 text-black dark:text-gray-300'}>
              {result.parallel ? (
                <ParallelIcon className="w-full h-full" />
              ) : (
                <SequenceIcon className="w-full h-full" />
              )}
            </span>
          </div>
        </Tooltip>

        <Typography
          variant="body2"
          className="text-gray-500 flex items-center gap-1"
        >
          <span className="text-black dark:text-white">
            {result.iterations}
          </span>
          {result.iterations === 1 ? 'iteration' : 'iterations'}{' '}
          {result.parallel ? 'in parallel' : 'in sequence'}{' '}
          <span>
            <span
              className={clsx(
                '!font-semibold',
                'tabular-nums',
                getSuccessColorClass(successPct)
              )}
            >
              {formatNumber(successPct, 0, 1)}%
            </span>{' '}
            successful.
          </span>
        </Typography>

        <div className="ml-auto flex gap-2">
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

          <div className="w-full bg-white/20 dark:bg-black/20 hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-md">
            <ButtonBase
              className="text-xs w-full !p-1.5"
              onClick={toggleDetails}
            >
              {detailsOpen ? 'Hide' : 'Show'} details
            </ButtonBase>
          </div>
        </div>
      </div>

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
            className="ml-6 flex flex-col gap-1"
          >
            <div className="bg-gray-200 dark:bg-gray-800 border-4 border-solid dark:border-black/5 rounded-md overflow-auto">
              <Typography
                variant="caption"
                className="sticky left-0 flex w-full p-2 border-b border-solid border-gray-500/10"
              >
                Statistics
              </Typography>
              <ResultStats result={result} />
            </div>

            <div className="bg-gray-200 dark:bg-gray-800 border-4 border-solid dark:border-black/5 rounded-md overflow-auto">
              <Typography
                variant="caption"
                className="sticky left-0 flex w-full p-2 border-b border-solid border-gray-500/10"
              >
                Responses
              </Typography>

              <ResultHistoryTableLogList
                iterations={result.iterations}
                logs={result.logs}
              />
            </div>

            <div className="bg-gray-200 dark:bg-gray-800 border-4 border-solid dark:border-black/5 rounded-md overflow-auto">
              <Typography
                variant="caption"
                className="sticky left-0 flex w-full p-2 border-b border-solid border-gray-500/10"
              >
                Configuration
              </Typography>
              <ul
                key={'stats-list'}
                className="grid grid-cols-3 md:flex items-center justify-center gap-4"
              >
                {config.map(({ label, value }, index) => (
                  <li
                    key={index}
                    className="flex flex-col items-center border-l border-gray-500 border-opacity-20 first:border-0 p-2"
                  >
                    <Typography variant="body2">{value}</Typography>
                    <Typography variant="caption" className="opacity-50">
                      {label}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </div>
  );
};
