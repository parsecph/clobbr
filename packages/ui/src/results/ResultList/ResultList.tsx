import { orderBy } from 'lodash-es';
import { motion, AnimatePresence } from 'framer-motion';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import List from '@mui/material/List';
import Result from 'results/Result/Result';

const ResultList = ({ list }: { list: Array<ClobbrUIResultListItem> }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        layout
      >
        <List className="w-full">
          {orderBy(list, ['latestResult.startDate'], ['desc']).map((item) => {
            return <Result item={item} key={item.id} />;
          })}
        </List>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultList;
