import { useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

const TIMEOUT_WAIT_IN_MINUTES = 3;

export const useResultProperties = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const timedOut = useMemo(() => {
    const startDate = item.latestResult.startDate as string;
    const endDate = item.latestResult.endDate;

    return !!(
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

  return {
    timedOut,
    isInProgress,
    successfulItems,
    failedItems,
    allFailed
  };
};
