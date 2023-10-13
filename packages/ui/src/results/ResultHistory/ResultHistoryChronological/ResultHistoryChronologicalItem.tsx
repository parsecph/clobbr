import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Typography } from '@mui/material';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

import { ResultStats } from 'results/ResultStats/ResultStats';
import { formatNumber } from 'shared/util/numberFormat';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';
import { ResultHistoryTableLogList } from 'results/ResultHistory/ResultHistoryTable/ResultHistoryTableLogList';
import { ResultHistoryChronologicalItemTitle } from 'results/ResultHistory/ResultHistoryChronological/ResultHistoryChronologicalItemTitle';

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

  return (
    <div className="relative flex flex-col gap-2 p-2" key={result.id}>
      <div className="w-px absolute -z-10 h-[calc(100%-1.5rem)] left-5 top-10 bg-gray-500/50" />

      <ResultHistoryChronologicalItemTitle
        result={result}
        toggleDetails={toggleDetails}
        successPct={successPct}
        index={index}
        detailsOpen={detailsOpen}
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
