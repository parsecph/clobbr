import { useContext, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { css } from '@emotion/css';
import {
  AnimatePresence,
  MotionValue,
  motion,
  usePresence
} from 'framer-motion';
import { useInterval, useMount } from 'react-use';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';

import { GlobalStore } from 'app/globalContext';

import { Alert, ButtonBase, CircularProgress, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { ReactComponent as AllFailed } from 'shared/images/search/AllFailed.svg';
import { ReactComponent as Timeout } from 'shared/images/search/Timeout.svg';
import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';
import { formatNumber } from 'shared/util/numberFormat';

import { ResultChart } from 'results/ResultChart/ResultChart';
import { ResultStats } from 'results/ResultStats/ResultStats';
import { ReRunResultButton } from 'results/ReRunResultButton/ReRunResultButton';
import { ResultHistoryToggle } from 'results/ResultHistory/ResultHistoryToggle';
import { UpdateSettingsButton } from 'results/UpdateSettingsButton/UpdateSettingsButton';
import { CommonlyFailedItem } from 'results/CommonlyFailedItem/CommonlyFailedItem';
import { useCommonlyFailedMessage } from 'results/CommonlyFailedItem/useCommonlyFailedMessage';

import ActivityIndicator from 'ActivityIndicator/ActivityIndicator';
import { mathUtils } from '@clobbr/api';
import { isNumber } from 'lodash-es';
import { nextTick } from 'shared/util/nextTick';

import { VERB_COLOR_CLASS_MAP } from 'shared/enums/VerbsToColorMap';

const xIconCss = css`
  && {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const TIMEOUT_WAIT_IN_MINUTES = 3;

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

const Result = ({
  item,
  expanded,
  animateOnTap = true,
  showUrl = true,
  showParallelOrSequenceIcon = true,
  className = '',
  listItemClassName = ''
}: {
  item: ClobbrUIResultListItem;
  expanded: boolean;
  animateOnTap?: boolean;
  showUrl?: boolean;
  showParallelOrSequenceIcon?: boolean;
  className?: string;
  listItemClassName?: string;
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
    !timedOut && item.latestResult.logs.length !== item.iterations;

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
    whileTap: animateOnTap ? 'tapped' : 'noop',
    variants: {
      in: { scaleY: 1, opacity: 1, transition: { delay: 0.3 } },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } }
    },
    onAnimationComplete: () => {
      nextTick(() => {
        if (isPresent && expanded && resultDom?.current) {
          // The idea with next tick is to allow the result group animation to fire first, if any.
          (resultDom.current as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });

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

  const onDeletePressed = () => {
    const currentScroll = document.documentElement.scrollTop;

    const nextResultList = globalStore.results.listRef.current.filter(
      (result: ClobbrUIResultListItem) => result.id !== item.id
    );
    globalStore.results.setList(nextResultList);

    nextTick(() => {
      // Hack: maintain scroll position after deleting an item.
      window.scrollTo(0, currentScroll);
    });
  };

  const averageDuration = useMemo(() => {
    const qualifiedDurations = item.latestResult.logs
      .filter((log) => !log.failed)
      .filter((log) => isNumber(log.metas.duration))
      .map((log) => log.metas.duration as number);

    if (!qualifiedDurations.length) {
      return 0;
    }

    if (qualifiedDurations.length === 1) {
      return qualifiedDurations[0];
    }

    return mathUtils.mean(qualifiedDurations);
  }, [item.latestResult.logs]);

  const durationColor = useMemo(
    () => getDurationColorClass(averageDuration),
    [averageDuration]
  );

  // Date formatting
  const [formattedDate, setFormattedDate] = useState('');

  useInterval(() => {
    const date = formatDistanceToNow(
      new Date(item.latestResult.startDate as string),
      {
        includeSeconds: true
      }
    );

    setFormattedDate(date);
  }, 3000);

  useMount(() => {
    const date = formatDistanceToNow(
      new Date(item.latestResult.startDate as string),
      {
        includeSeconds: true
      }
    );

    setFormattedDate(date);
  });

  return (
    <GlobalStore.Consumer>
      {({ results }) => (
        <motion.ul
          className={clsx(className, 'odd:bg-gray-200 dark:odd:bg-gray-800')}
          {...animations}
          ref={resultDom}
        >
          <ListItem className={clsx(listItemClassName, 'flex-wrap !w-auto')}>
            <AnimatePresence>
              {results.editing ? (
                <motion.div
                  animate={{
                    scale: [1, 0.8, 1]
                  }}
                  className="scale-90"
                  transition={{ duration: 0.3, times: [0, 0.7, 1] }}
                >
                  <ButtonBase
                    onClick={onDeletePressed}
                    color="primary"
                    component="a"
                    href="#"
                    className="flex !mr-1 !p-2 shrink-0"
                  >
                    <DoDisturbOnIcon className="text-red-500" />
                  </ButtonBase>
                </motion.div>
              ) : (
                ''
              )}
            </AnimatePresence>

            <ButtonBase onClick={onResultPressed} className="!contents">
              <ListItemText
                primary={
                  <span className="flex items-center gap-2 truncate mb-1">
                    {showUrl ? (
                      <Tooltip title={item.url}>
                        <span>{item.url.replace(/^https?:\/\//, '')}</span>
                      </Tooltip>
                    ) : (
                      ''
                    )}

                    {item.properties?.gql?.isGql ? (
                      <>
                        <small
                          className={clsx(
                            'px-2 py-0.5',
                            'rounded-sm text-black',
                            'bg-fuchsia-300'
                          )}
                        >
                          GQL
                        </small>

                        <small
                          className={clsx(
                            'px-2 py-0.5',
                            'rounded-sm text-black',
                            'bg-gray-300'
                          )}
                        >
                          {item.properties?.gql.gqlName}
                        </small>
                      </>
                    ) : (
                      <small
                        className={clsx(
                          'px-2 py-0.5',
                          'rounded-sm text-black',
                          VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
                        )}
                      >
                        {item.verb.toUpperCase()}
                      </small>
                    )}

                    {showParallelOrSequenceIcon ? (
                      <Tooltip title={item.parallel ? 'Parallel' : 'Sequence'}>
                        <div
                          className="flex items-center justify-center relative w-6 h-6 p-1 before:bg-gray-500 before:bg-opacity-10 before:flex before:w-full before:h-full before:absolute before:rounded-full"
                          aria-label="Toggle between parallel / sequence"
                        >
                          <span
                            className={
                              globalStore.themeMode === 'light'
                                ? 'text-black'
                                : 'text-gray-300'
                            }
                          >
                            {item.parallel ? (
                              <ParallelIcon className="w-full h-full" />
                            ) : (
                              <SequenceIcon className="w-full h-full" />
                            )}
                          </span>
                        </div>
                      </Tooltip>
                    ) : (
                      ''
                    )}

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
                    <Typography
                      variant="caption"
                      className="flex w-full text-left opacity-50"
                    >
                      {formattedDate ? `${formattedDate} ago` : '...'}
                    </Typography>
                  </>
                }
              />

              <div className="flex flex-col gap-1 items-end justify-between">
                {!allFailed && !timedOut ? (
                  <Tooltip title="Average response time (mean)">
                    <Typography
                      variant="body2"
                      className={clsx(durationColor, '!font-semibold')}
                    >
                      {formatNumber(averageDuration, 0, 0)} ms
                    </Typography>
                  </Tooltip>
                ) : (
                  ''
                )}

                {allFailed ? (
                  <Typography variant="body2" className="opacity-50">
                    Failed
                  </Typography>
                ) : (
                  ''
                )}

                {timedOut ? (
                  <Typography variant="body2" className="opacity-50">
                    Timed out
                  </Typography>
                ) : (
                  ''
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
            </ButtonBase>
          </ListItem>

          <AnimatePresence>
            {expanded && allFailed ? (
              <div className="flex flex-col gap-2 pb-12 items-center">
                <AllFailed className="w-full max-w-xs py-6 pt-6" />
                <Typography variant="body1">
                  <strong className="font-semibold">
                    All requests failed. Some common issues could be:
                  </strong>
                </Typography>
                <hr />
                <ul className="list-disc pl-6">
                  <li>
                    <Typography variant="body2">
                      Incorrect method (i.e. should use POST instead of GET)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      CORS issues; some custom headers might be needed
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Authorization failed; also might require headers
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Used http instead of https to make the request
                    </Typography>
                  </li>
                </ul>

                <div className="px-4 py-2 mt-6 mb-2">
                  <CommonlyFailedItem item={item} />
                </div>

                <ResultHistoryToggle item={item} />

                <div className="flex gap-2 mt-4">
                  <ReRunResultButton item={item} />
                  <UpdateSettingsButton item={item} />
                </div>
              </div>
            ) : (
              ''
            )}

            {expanded && timedOut ? (
              <div className="flex flex-col gap-4 pb-12 items-center">
                <Timeout className="w-full max-w-xs p-6" />
                <Typography variant="body1">
                  <strong className="font-semibold">Requests timed out</strong>
                </Typography>

                <Typography variant="body2" className="opacity-50">
                  Try reducing the number of iterations and run again? <br />
                </Typography>

                <ResultHistoryToggle item={item} />

                <div className="flex gap-2 mt-4">
                  <ReRunResultButton item={item} />
                  <UpdateSettingsButton item={item} />
                </div>
              </div>
            ) : (
              ''
            )}

            {expanded &&
            !isInProgress &&
            !shouldShowChart &&
            !timedOut &&
            !allFailed ? (
              <>
                <Typography variant="body2" className="opacity-50 text-center">
                  Increase the number of itetations to see more stats.
                </Typography>

                <ResultHistoryToggle item={item} />

                <div className="mt-4">
                  <ResultStats result={item.latestResult} />
                </div>

                <div className="flex justify-center gap-2 px-2 py-6 mt-8">
                  <ReRunResultButton item={item} />
                  <UpdateSettingsButton item={item} />
                </div>
              </>
            ) : (
              ''
            )}

            {shouldShowChart ? (
              <div className="relative">
                {isInProgress ? (
                  <div className="h-72 flex flex-col items-center justify-center gap-8">
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
                    <ResultHistoryToggle item={item} />
                    <ResultChart item={item} />
                    <ResultStats result={item.latestResult} />

                    <footer className="flex flex-col items-center justify-center gap-2 pb-4">
                      {failedItems.length ? (
                        <Tooltip title={message || ''}>
                          <div className="flex flex-col items-center">
                            <Alert severity="error">
                              {failedItems.length} failed. Showing results only
                              for successful requests.
                            </Alert>
                          </div>
                        </Tooltip>
                      ) : (
                        ''
                      )}

                      <div className="flex gap-2 mt-4">
                        <ReRunResultButton item={item} />
                        <UpdateSettingsButton item={item} />
                      </div>
                    </footer>
                  </>
                )}
              </div>
            ) : (
              ''
            )}
          </AnimatePresence>
        </motion.ul>
      )}
    </GlobalStore.Consumer>
  );
};

export default Result;
