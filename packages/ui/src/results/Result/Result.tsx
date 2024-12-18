import { useContext, useMemo, useRef, useState } from 'react';
import MediaQuery from 'react-responsive';
import clsx from 'clsx';
import { css } from '@emotion/css';
import {
  AnimatePresence,
  MotionValue,
  motion,
  usePresence
} from 'framer-motion';
import { useInterval, useMount } from 'react-use';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { GlobalStore } from 'app/globalContext';

import { ButtonBase, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';
import { formatNumber } from 'shared/util/numberFormat';
import { getDurationColorClass } from 'shared/util/getDurationColorClass';

import { mathUtils } from '@clobbr/api';
import { isNumber } from 'lodash-es';
import { nextTick } from 'shared/util/nextTick';

import ResultContent from 'results/Result/ResultContent/ResultContent';
import { ResultListItemPrimaryContent } from 'results/Result/ResultListItemPrimaryContent/ResultListItemPrimaryContent';
import { ResultListItemSecondaryContent } from 'results/Result/ResultListItemSecondaryContent/ResultListItemSecondaryContent';
import { useResultProperties } from 'results/Result/useResultProperties';

import { mediaQueries } from 'shared/mediaQueries';

const xIconCss = css`
  && {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const Result = ({
  item,
  expanded,
  animateOnTap = true,
  showUrl = true,
  showParallelOrSequenceIcon = true,
  className = '',
  listItemClassName = ''
}: {
  item: ClobbrUIListItem;
  expanded: boolean;
  animateOnTap?: boolean;
  showUrl?: boolean;
  showParallelOrSequenceIcon?: boolean;
  className?: string;
  listItemClassName?: string;
}) => {
  const { allFailed, isPartiallyComplete } = useResultProperties({
    item
  });

  const resultDom = useRef(null);
  const globalStore = useContext(GlobalStore);
  const [isPresent, safeToRemove] = usePresence();

  const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };

  const animations = {
    initial: 'out',
    style: {
      position: (isPresent
        ? 'static'
        : 'absolute') as unknown as MotionValue<string>
    },
    animate: isPresent ? 'in' : 'out',
    whileTap: animateOnTap ? 'tapped' : 'tapped-not-animated',
    variants: {
      in: { scaleY: 1, opacity: 1, transition: { delay: 0.3 } },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } }
    },
    onAnimationComplete: () => {
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
      globalStore.results.updateExpandedResults([item.listItemId]);

      setTimeout(() => {
        if (resultDom?.current) {
          (resultDom.current as HTMLElement).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    }
  };

  const onDeletePressed = () => {
    const currentScroll = document.documentElement.scrollTop;

    const nextResultList = globalStore.results.listRef.current.filter(
      (result: ClobbrUIListItem) => result.listItemId !== item.listItemId
    );
    globalStore.results.setList(nextResultList);

    nextTick(() => {
      // Hack: maintain scroll position after deleting an item.
      window.scrollTo(0, currentScroll);
    });
  };

  const averageDuration = useMemo(() => {
    const qualifiedDurations = item.logs
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
  }, [item.logs]);

  const durationColor = useMemo(
    () => getDurationColorClass(averageDuration),
    [averageDuration]
  );

  // Date formatting
  const [formattedDate, setFormattedDate] = useState('');

  useInterval(() => {
    const date = formatDistanceToNow(new Date(item.startDate as string), {
      includeSeconds: true
    });

    setFormattedDate(date);
  }, 3000);

  useMount(() => {
    const date = formatDistanceToNow(new Date(item.startDate as string), {
      includeSeconds: true
    });

    setFormattedDate(date);
  });

  return (
    <GlobalStore.Consumer>
      {({ results }) => (
        <motion.ul
          className={clsx(
            className,
            expanded
              ? 'xl:bg-gradient-to-r xl:from-transparent xl:via-primary-500/5 xl:to-primary-500/30 xl:dark:to-primary-700/20'
              : '',
            'odd:bg-slate-100 dark:odd:bg-gray-800',
            'even:bg-white dark:even:bg-zinc-900'
          )}
          {...animations}
          ref={resultDom}
        >
          <ListItem className={clsx(listItemClassName, '!w-auto gap-4')}>
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
                  <ResultListItemPrimaryContent
                    item={item}
                    showUrl={showUrl}
                    showParallelOrSequenceIcon={showParallelOrSequenceIcon}
                    themeMode={globalStore.themeMode}
                  />
                }
                secondary={
                  <ResultListItemSecondaryContent
                    formattedDate={formattedDate}
                  />
                }
              />

              <div className="flex flex-col flex-shrink-0 gap-1 items-end justify-between">
                {!allFailed ? (
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

                  {isPartiallyComplete ? (
                    <Tooltip
                      title={`${item.logs.length} ${
                        item.logs.length === 1 ? 'call' : 'calls'
                      } ran`}
                    >
                      <Typography variant="body2" className="opacity-50">
                        Partial
                      </Typography>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                </Typography>
              </div>
            </ButtonBase>
          </ListItem>

          <MediaQuery maxWidth={mediaQueries.xl}>
            <ResultContent item={item} expanded={expanded} />
          </MediaQuery>
        </motion.ul>
      )}
    </GlobalStore.Consumer>
  );
};

export default Result;
