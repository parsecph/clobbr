import { orderBy } from 'lodash-es';
import { motion, AnimatePresence } from 'framer-motion';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { GlobalStore } from 'App/globalContext';

import List from '@mui/material/List';
import Result from 'results/Result/Result';

const MAX_RESULTS = 100;

const ResultList = ({ list }: { list: Array<ClobbrUIResultListItem> }) => {
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
            <List className="w-full">
              {orderBy(list, ['latestResult.startDate'], ['desc'])
                .slice(0, MAX_RESULTS)
                .map((item) => {
                  return (
                    <Result
                      item={item}
                      key={item.id}
                      expanded={results.expandedResults.includes(item.id)}
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
