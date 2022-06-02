import { useContext, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { css } from '@emotion/css';
import {
  AnimatePresence,
  MotionValue,
  motion,
  usePresence
} from 'framer-motion';
import { useInterval } from 'react-use';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';

import { GlobalStore } from 'App/globalContext';

import { Alert, CircularProgress, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import { Lock, LockOpen } from '@mui/icons-material';

import { VERBS } from 'shared/enums/http';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { ReactComponent as AllFailed } from 'shared/images/search/AllFailed.svg';
import { ReactComponent as Timeout } from 'shared/images/search/Timeout.svg';
import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';

import { ResultChart } from 'results/ResultChart/ResultChart';
import { CommonlyFailedItem } from 'results/CommonlyFailedItem/CommonlyFailedItem';
import { useCommonlyFailedMessage } from 'results/CommonlyFailedItem/useCommonlyFailedMessage';

import ActivityIndicator from 'ActivityIndicator/ActivityIndicator';

const xIconCss = css`
  && {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const VERB_COLOR_CLASS_MAP = {
  [VERBS.GET]: 'bg-blue-200',
  [VERBS.POST]: 'bg-green-200',
  [VERBS.PUT]: 'bg-orange-200',
  [VERBS.DELETE]: 'bg-red-200'
};

const DURATION_COLOR_MAP: { [key: number]: string } = {
  0: 'text-green-400',
  1: 'text-yellow-400',
  2: 'text-orange-400',
  3: 'text-red-600'
};

export const getDurationColorClass = (duration: number): string => {
  const roundedDuration = Math.round(duration / 1000);

  return DURATION_COLOR_MAP[roundedDuration]
    ? DURATION_COLOR_MAP[roundedDuration]
    : 'text-red-400';
};

const TIMEOUT_WAIT_IN_MINUTES = 3;

const Result = ({
  item,
  expanded
}: {
  item: ClobbrUIResultListItem;
  expanded: boolean;
}) => {
  const resultDom = useRef(null);
  const globalStore = useContext(GlobalStore);
  const [isPresent, safeToRemove] = usePresence();

  const timedOut = useMemo(() => {
    const startDate = item.latestResult.startDate as string;
    const endDate = item.latestResult.endDate;

    return (
      startDate &&
      !endDate &&
      differenceInMinutes(new Date(), new Date(startDate)) >
        TIMEOUT_WAIT_IN_MINUTES
    );
  }, [item.latestResult.startDate, item.latestResult.endDate]);

  const isInProgress =
    !timedOut && item.latestResult.resultDurations.length !== item.iterations;

  const percentageOfCompleteness = Math.round(
    (item.latestResult.resultDurations.length * 100) / item.iterations
  );

  const successfulItems = item.latestResult.logs.filter((log) => !log.failed);

  const failedItems = item.latestResult.logs.filter((log) => log.failed);

  const allFailed = failedItems.length === item.iterations;

  const { message } = useCommonlyFailedMessage({
    logs: item.latestResult.logs
  });

  const shouldShowChart =
    !allFailed &&
    !timedOut &&
    expanded &&
    item.iterations > 1 &&
    successfulItems.length > 1;

  const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };

  const animations = {
    initial: 'out',
    style: {
      position: (isPresent
        ? 'static'
        : 'absolute') as unknown as MotionValue<string>
    },
    animate: isPresent ? 'in' : 'out',
    whileTap: 'tapped',
    variants: {
      in: { scaleY: 1, opacity: 1, transition: { delay: 0.3 } },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } }
    },
    onAnimationComplete: () => {
      if (expanded && resultDom?.current) {
        (resultDom.current as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      if (!isPresent) {
        safeToRemove();
      }
    },
    transition
  };

  const onResultPressed = () => {
    if (expanded) {
      globalStore.results.updateExpandedResults([]);
    } else {
      globalStore.results.updateExpandedResults([item.id]);
    }
  };

  // Date formatting
  const [formattedDate, setFormattedDate] = useState('');
  const durationColor = useMemo(
    () => getDurationColorClass(item.latestResult.averageDuration),
    [item.latestResult.averageDuration]
  );

  useInterval(() => {
    const date = formatDistanceToNow(
      new Date(item.latestResult.startDate as string),
      {
        includeSeconds: true
      }
    );

    setFormattedDate(date);
  }, 3000);

  return (
    <motion.button
      className="odd:bg-gray-200 dark:odd:bg-gray-800 w-full"
      {...animations}
      onClick={onResultPressed}
      ref={resultDom}
    >
      <ListItem className="flex-wrap">
        <ListItemText
          primary={
            <span className="flex items-center gap-2 truncate mb-1">
              <span className="flex items-center gap-1">
                <Tooltip
                  title={!item.ssl ? 'http (Secure)' : 'https (Insecure)'}
                >
                  {item.ssl ? (
                    <Lock fontSize="small" />
                  ) : (
                    <LockOpen fontSize="small" />
                  )}
                </Tooltip>

                {item.url.replace(/^https?:\/\//, '')}
              </span>

              <small
                className={clsx(
                  'px-2 py-0.5',
                  'rounded-sm text-black',
                  VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
                )}
              >
                {item.verb}
              </small>

              {isInProgress ? (
                <div className="flex items-center">
                  <CircularProgress size={14} />
                </div>
              ) : (
                <></>
              )}
            </span>
          }
          secondary={
            <>
              <Typography variant="caption" className="opacity-50">
                {formattedDate ? `${formattedDate} ago` : '...'}
              </Typography>
            </>
          }
        />

        <div className="flex flex-col gap-1 items-end justify-between">
          {!allFailed ? (
            <Tooltip title="Average response time">
              <Typography
                variant="body2"
                className={clsx(durationColor, '!font-semibold')}
              >
                {item.latestResult.averageDuration} ms
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" className="opacity-50">
              Failed
            </Typography>
          )}

          <Typography
            variant="caption"
            className="flex items-center gap-1 justify-center opacity-50"
          >
            <Tooltip title={item.parallel ? 'Parallel' : 'Sequence'}>
              <div className="dark:!text-gray-300 w-4 h-4">
                {item.parallel ? (
                  <ParallelIcon className="w-full h-full" />
                ) : (
                  <SequenceIcon className="w-full h-full" />
                )}
              </div>
            </Tooltip>

            <Tooltip title="Number of calls">
              <span>
                {item.iterations}
                <CloseIcon className={xIconCss} />
              </span>
            </Tooltip>
          </Typography>
        </div>
      </ListItem>

      <AnimatePresence>
        {allFailed && expanded ? (
          <div className="flex flex-col gap-4 pb-12 items-center">
            <AllFailed className="w-full max-w-xs p-6" />
            <Typography variant="body1">
              <strong className="font-semibold">All requests failed</strong>
            </Typography>
            <hr />
            <ul>
              <li>
                <Typography variant="body2">
                  Did you by chance use the incorrect verb?
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Does your server require authentication?
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Do you need to include custom headers?
                </Typography>
              </li>
            </ul>

            <CommonlyFailedItem item={item} />
          </div>
        ) : (
          ''
        )}

        {timedOut && expanded ? (
          <div className="flex flex-col gap-4 pb-12 items-center">
            <Timeout className="w-full max-w-xs p-6" />
            <Typography variant="body1">
              <strong className="font-semibold">Requests timed out</strong>
            </Typography>

            <Typography variant="body2" className="opacity-50">
              Perhaps give it another try? <br />
              Maybe it'll work this time...
            </Typography>
          </div>
        ) : (
          ''
        )}

        {shouldShowChart ? (
          <div className="relative">
            {isInProgress ? (
              <div className="h-80 flex flex-col items-center justify-center gap-8">
                <div
                  className="absolute transition-all bottom-0 left-0 h-1 bg-gradient-to-r from-primary-300 to-primary-700"
                  style={{ width: percentageOfCompleteness + '%' }}
                  aria-hidden="true"
                ></div>

                <ActivityIndicator
                  animationIterations="infinite"
                  startDelay={0}
                />
                <Typography variant="caption">
                  {item.latestResult.resultDurations.length <
                  item.iterations / 2
                    ? 'Getting results'
                    : 'Almost there'}
                </Typography>
              </div>
            ) : (
              <>
                <ResultChart item={item} />

                {failedItems.length ? (
                  <Tooltip title={message || ''}>
                    <div className="flex flex-col items-center mb-2">
                      <Alert severity="error">
                        {failedItems.length} failed. Showing results only for
                        successful requests.
                      </Alert>
                    </div>
                  </Tooltip>
                ) : (
                  ''
                )}
              </>
            )}
          </div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default Result;
