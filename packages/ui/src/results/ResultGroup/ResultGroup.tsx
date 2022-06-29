import { useContext, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  usePresence
} from 'framer-motion';
import { useInterval } from 'react-use';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';

import { GlobalStore } from 'App/globalContext';

import { ButtonBase, CircularProgress, Typography } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Result from 'results/Result/Result';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

const TIMEOUT_WAIT_IN_MINUTES = 3;

const ResultGroup = ({
  items,
  url,
  expanded
}: {
  items: Array<ClobbrUIResultListItem>;
  url: string;
  expanded: boolean;
}) => {
  const globalStore = useContext(GlobalStore);

  const resultDom = useRef(null);
  const [isPresent, safeToRemove] = usePresence();

  const timedOut = useMemo(() => {
    return items.some((item) => {
      const startDate = item.latestResult.startDate as string;
      const endDate = item.latestResult.endDate;

      return (
        startDate &&
        !endDate &&
        differenceInMinutes(new Date(), new Date(startDate)) >
          TIMEOUT_WAIT_IN_MINUTES
      );
    });
  }, [items]);

  const isInProgress =
    !timedOut &&
    items.some(
      (item) => item.latestResult.resultDurations.length !== item.iterations
    );

  const isSsl = items.some((items) => items.ssl);

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

  const onResultGroupPressed = () => {
    if (globalStore.results.expandedResultGroups.includes(url)) {
      globalStore.results.updateExpandedResultGroups([]);
    } else {
      globalStore.results.updateExpandedResultGroups([url]);
    }
  };

  // Date formatting
  const [formattedDate, setFormattedDate] = useState('');

  useInterval(() => {
    const date = formatDistanceToNow(
      new Date(items[0].latestResult.startDate as string),
      {
        includeSeconds: true
      }
    );

    setFormattedDate(date);
  }, 3000);

  return (
    <GlobalStore.Consumer>
      {({ results }) => (
        <motion.div
          className="odd:bg-gray-200 dark:odd:bg-gray-800 w-full"
          {...animations}
          ref={resultDom}
        >
          <ButtonBase onClick={onResultGroupPressed} className="!contents">
            <ListItem className="flex-wrap">
              <ListItemText
                primary={
                  <span className="flex items-center gap-2 truncate mb-1">
                    <span className="flex items-center gap-1">
                      <Tooltip
                        title={!isSsl ? 'http (Secure)' : 'https (Insecure)'}
                      >
                        {isSsl ? (
                          <Lock fontSize="small" />
                        ) : (
                          <LockOpen fontSize="small" />
                        )}
                      </Tooltip>

                      {url.replace(/^https?:\/\//, '')}
                    </span>

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
                <Typography
                  variant="caption"
                  className="flex items-center gap-1 justify-center opacity-50"
                >
                  <Tooltip title="Number of requests in this group">
                    <span>{items.length} requests</span>
                  </Tooltip>
                </Typography>
              </div>
            </ListItem>
          </ButtonBase>

          <AnimatePresence>
            {expanded
              ? items.map((item) => (
                  <Result
                    item={item}
                    key={item.id}
                    expanded={results.expandedResults.includes(item.id)}
                    showSsl={false}
                    showUrl={false}
                    className="border-t border-solid border-gray-500 border-opacity-30 bg-inherit dark:bg-inherit odd:bg-inherit dark:odd:bg-inherit"
                    listItemClassName="!pl-10"
                  />
                ))
              : ''}
          </AnimatePresence>
        </motion.div>
      )}
    </GlobalStore.Consumer>
  );
};

export default ResultGroup;
