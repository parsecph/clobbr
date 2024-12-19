import clsx from 'clsx';
import { useContext, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  usePresence
} from 'framer-motion';
import { useInterval } from 'react-use';
import { formatDistanceToNow } from 'date-fns';

import { GlobalStore } from 'app/globalContext';

import { ButtonBase, CircularProgress, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Result from 'results/Result/Result';
import { VERB_COLOR_CLASS_MAP } from 'shared/enums/VerbsToColorMap';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

const ResultGroup = ({
  items,
  url,
  expanded
}: {
  items: Array<ClobbrUIListItem>;
  url: string;
  expanded: boolean;
}) => {
  const globalStore = useContext(GlobalStore);

  const resultDom = useRef(null);
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
    whileTap: 'tapped',
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

  const onResultGroupPressed = () => {
    if (globalStore.results.expandedResultGroups.includes(url)) {
      globalStore.results.updateExpandedResultGroups([]);
    } else {
      globalStore.results.updateExpandedResultGroups([url]);

      setTimeout(() => {
        if (resultDom?.current) {
          (resultDom.current as HTMLElement).scrollIntoView({
            behavior: 'auto',
            block: 'center'
          });
        }
      }, 0);
    }
  };

  // Date formatting
  const [formattedDate, setFormattedDate] = useState('');

  useInterval(() => {
    const date = formatDistanceToNow(new Date(items[0].startDate as string), {
      includeSeconds: true
    });

    setFormattedDate(date);
  }, 3000);

  return (
    <GlobalStore.Consumer>
      {({ results, search }) => (
        <motion.div
          className={clsx(
            'w-full',
            'odd:bg-slate-100 dark:odd:bg-gray-800',
            'even:bg-white dark:even:bg-zinc-900'
          )}
          {...animations}
          ref={resultDom}
        >
          <ButtonBase onClick={onResultGroupPressed} className="!contents">
            <ListItem className="flex-wrap">
              <ListItemText
                primary={
                  <span className="flex items-center gap-2 truncate mb-1">
                    <Tooltip title={url}>
                      <span className="truncate">
                        {url.replace(/^https?:\/\//, '')}
                      </span>
                    </Tooltip>

                    {items.some(
                      ({ listItemId }) =>
                        listItemId === search.inProgressListItemId
                    ) ? (
                      <div className="flex items-center">
                        <CircularProgress size={14} />
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="flex gap-1 -mt-1">
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div
                            key={item.verb}
                            animate={{
                              scale: [1, 0.8, 1]
                            }}
                            className="scale-90"
                            transition={{ duration: 0.3, times: [0, 0.7, 1] }}
                          >
                            <small
                              className={clsx(
                                'inline-block px-1 py-0.5',
                                'rounded-sm text-black',
                                VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
                              )}
                              style={{ fontSize: '0.6rem' }}
                            >
                              {item.verb.toUpperCase()}
                            </small>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
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
                  <Tooltip title="Number of results in this group">
                    <span>
                      {items.length} {items.length === 1 ? 'result' : 'results'}
                    </span>
                  </Tooltip>
                </Typography>
              </div>
            </ListItem>
          </ButtonBase>

          <AnimatePresence>
            {expanded ? (
              <div className="border-t border-solid border-gray-500 border-opacity-30">
                {items.map((item, index) => {
                  const isExpanded = results.expandedResults.includes(
                    item.listItemId
                  );
                  const hasBorder = index !== items.length - 1;

                  return (
                    <Result
                      item={item}
                      key={item.listItemId}
                      expanded={isExpanded}
                      animateOnTap={false}
                      className={clsx(
                        isExpanded && !search.inProgress ? 'pb-4 xl:pb-0' : '',
                        isExpanded && hasBorder
                          ? 'border-b border-solid border-gray-500 border-opacity-30'
                          : '',
                        'bg-inherit dark:bg-inherit odd:bg-inherit dark:odd:bg-inherit even:bg-inherit dark:even:bg-inherit'
                      )}
                      showUrl={false}
                      listItemClassName={clsx(
                        isExpanded ? '!pl-10' : '!pl-0 !ml-10',
                        !isExpanded && hasBorder
                          ? 'border-b border-solid border-gray-500 border-opacity-30'
                          : ''
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </GlobalStore.Consumer>
  );
};

export default ResultGroup;
