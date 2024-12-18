import { useInterval } from 'react-use';
import { Typography } from '@mui/material';
import { isNumber } from 'lodash-es';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { getLogStats } from 'shared/util/getLogStats';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlobalStore } from 'app/globalContext';
import clsx from 'clsx';

export const getResultStats = (result: ClobbrUIResult) => {
  const qualifiedDurations = result.logs
    .filter((log) => !log.failed)
    .filter((log) => isNumber(log.metas.duration));

  if (!qualifiedDurations.length || qualifiedDurations.length === 1) {
    return null;
  }

  return getLogStats(result.logs, result);
};

export const ResultStats = ({
  result,
  otherStats
}: {
  result: ClobbrUIResult;
  otherStats?: Array<{
    label: string;
    value: string;
    colorClass: string;
  }>;
}) => {
  const globalStore = useContext(GlobalStore);

  const [stats, setStats] = useState<Array<{
    label: string;
    value: string;
    unit: string;
    colorClass: string;
  }> | null>(null);

  useInterval(() => {
    if (globalStore.search.inProgress) {
      setStats(getResultStats(result));
    }
  }, 1000);

  useEffect(() => {
    // Set once on mount
    setStats(getResultStats(result));
  }, []);

  return (
    <GlobalStore.Consumer>
      {({ search }) =>
        stats ? (
          <ul
            key={'stats-list'}
            className="grid grid-cols-3 md:flex items-center justify-center gap-4 min-h-[100px]"
          >
            {stats.map(({ label, value, unit }, index) => (
              <motion.li
                key={index}
                className="flex flex-col items-center border-l border-gray-500 border-opacity-20 first:border-0 p-2 min-w-[100px] text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="body2">
                  {value} {unit}
                </Typography>
                <Typography
                  variant="caption"
                  className="!text-[0.7rem] lg:!text-xs opacity-50"
                >
                  {label}
                </Typography>
              </motion.li>
            ))}

            {otherStats ? (
              otherStats.map(({ label, value }, index) => (
                <motion.li
                  key={`o${index}`}
                  className="flex flex-col items-center border-l border-gray-500 border-opacity-20 first:border-0 p-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="body2">{value}</Typography>
                  <Typography variant="caption" className="opacity-50">
                    {label}
                  </Typography>
                </motion.li>
              ))
            ) : (
              <></>
            )}
          </ul>
        ) : (
          <Typography
            className={clsx(
              '!text-xs text-center opacity-50 p-2 min-h-[100px] flex items-center justify-center',
              search.inProgress ? 'opacity-0' : ''
            )}
          >
            No statistics available
          </Typography>
        )
      }
    </GlobalStore.Consumer>
  );
};
