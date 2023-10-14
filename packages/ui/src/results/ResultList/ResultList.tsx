import { useContext } from 'react';
import { orderBy } from 'lodash-es';
import { motion, AnimatePresence } from 'framer-motion';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

import { GlobalStore } from 'app/globalContext';

import List from '@mui/material/List';
import Result from 'results/Result/Result';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ResultGroup from 'results/ResultGroup/ResultGroup';

const MAX_RESULTS = 100;

const ResultList = ({
  list,
  className
}: {
  list: Array<ClobbrUIListItem>;
  className?: string;
}) => {
  const globalStore = useContext(GlobalStore);

  const resultsByUrl = orderBy(
    globalStore.results.list,
    ['latestResult.startDate'],
    ['desc']
  ).reduce(
    (acc, cur: ClobbrUIListItem) => {
      const isGql = cur.properties?.gql?.isGql;

      const key = isGql
        ? `${cur.properties?.gql?.gqlName}-${cur.url}`
        : cur.url;

      if (acc[key]) {
        acc[key].list = acc[key].list.concat(cur);
      } else {
        acc[key] = {
          url: cur.url,
          list: [cur]
        };
      }

      return acc;
    },
    {} as {
      [key: string]: { url: string; list: Array<ClobbrUIListItem> };
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
            className={className}
          >
            <div className="flex justify-end px-2 py-1 -mb-2 xl:sticky top-0 z-10 xl:bg-white/90 xl:dark:bg-zinc-900/90 backdrop-blur-sm">
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
