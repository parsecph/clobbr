import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { ReactComponent as Select } from 'shared/images/results/Select.svg';

export const NoResultSelected = () => {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 opacity-0"
      animate={{
        opacity: [0, 0.9, 1]
      }}
      transition={{ duration: 2, times: [0, 0.7, 1] }}
    >
      <Select className="w-full flex-grow-0 flex-shrink-0 max-w-xs py-6 px-12" />

      <Typography variant="body1">
        <strong className="font-semibold">No result selected</strong>
      </Typography>

      <Typography variant="body2" className="text-center opacity-50">
        Select a result to view more details.
      </Typography>
    </motion.div>
  );
};
