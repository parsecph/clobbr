import { useContext } from 'react';
import { orderBy } from 'lodash-es';
import { motion, AnimatePresence } from 'framer-motion';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { GlobalStore } from 'App/globalContext';

import List from '@mui/material/List';
import Result from 'results/Result/Result';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ResultGroup from 'results/ResultGroup/ResultGroup';

const MAX_RESULTS = 100;

const ResultList = ({ list }: { list: Array<ClobbrUIResultListItem> }) => {
  const globalStore = useContext(GlobalStore);

  const resultsByUrl = orderBy(
    globalStore.results.list,
    ['latestResult.startDate'],
    ['desc']
  ).reduce(
    (acc, cur: ClobbrUIResultListItem) => {
      if (acc[cur.url]) {
        acc[cur.url].list = acc[cur.url].list.concat(cur);
      } else {
        acc[cur.url] = {
          url: cur.url,
          list: [cur]
        };
      }

      return acc;
    },
    {} as {
      [key: string]: { url: string; list: Array<ClobbrUIResultListItem> };
    }
  );

  return (
    <GlobalStore.Consumer>
      {({ results }) => (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            exit={{ opacity: 0 }}
            layout
          >
            <div className="flex justify-end px-2">
              <Button
                size="small"
                variant="text"
                className="opacity-50 hover:opacity-100 transition-all !min-w-0"
                onClick={() => results.toggleEdit()}
              >
                <span className="flex gap-1 items-center text-black dark:text-white ">
                  <Typography variant="body2">
                    {results.editing ? 'Done' : 'Edit'}
                  </Typography>
                </span>
              </Button>
            </div>

            <List className="w-full !pb-0">
              {Object.keys(resultsByUrl)
                .slice(0, MAX_RESULTS)
                .map((key) => {
                  const result = resultsByUrl[key];

                  if (result.list.length > 1) {
                    const expanded = result.list.some((item) =>
                      results.expandedResultGroups.includes(item.url)
                    );

                    return (
                      <ResultGroup
                        items={result.list}
                        url={result.url}
                        key={result.url}
                        expanded={expanded}
                      />
                    );
                  }

                  const expanded = results.expandedResults.includes(
                    result.list[0].id
                  );

                  return (
                    <Result
                      item={result.list[0]}
                      key={result.list[0].id}
                      expanded={expanded}
                    />
                  );
                })}
            </List>
          </motion.div>
        </AnimatePresence>
      )}
    </GlobalStore.Consumer>
  );
};

export default ResultList;
