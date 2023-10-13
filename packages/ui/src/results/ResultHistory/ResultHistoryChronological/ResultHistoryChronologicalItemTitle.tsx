import clsx from 'clsx';

import { format } from 'date-fns';
import { formatNumber } from 'shared/util/numberFormat';

import { ButtonBase, Tooltip, Typography } from '@mui/material';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';
import { ClobbrUIResult } from 'models/ClobbrUIResult';

export const ResultHistoryChronologicalItemTitle = ({
  result,
  toggleDetails,
  detailsOpen,
  successPct,
  index,
  expandLabel = 'Show details',
  collapseLabel = 'Hide details'
}: {
  result: ClobbrUIResult;
  toggleDetails: () => void;
  detailsOpen: boolean;
  successPct: number;
  index: number;
  expandLabel?: string;
  collapseLabel?: string;
}) => {
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
        <span className="text-black dark:text-white">{result.iterations}</span>
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
            title={format(new Date(result.startDate), 'dd MMMM yyyy HH:mm:ss')}
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

        <div className="w-full bg-white/20 dark:bg-black/20 hover:bg-gray-200/40 hover:dark:bg-black/40 transition-all flex justify-center rounded-md overflow-hidden">
          <ButtonBase className="text-xs w-full !p-1.5" onClick={toggleDetails}>
            {detailsOpen ? collapseLabel : expandLabel}
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};
