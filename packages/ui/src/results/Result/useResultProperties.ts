import { useMemo } from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

const TIMEOUT_WAIT_IN_MINUTES = 3;

export const useResultProperties = ({ item }: { item?: ClobbrUIListItem }) => {
  const itemInternal = item || {
    latestResult: {
      endDate: new Date(),
      startDate: new Date()
    }
  };

  const timedOut = useMemo(() => {
    const startDate = itemInternal.latestResult.startDate as string;
    const endDate = itemInternal.latestResult.endDate;

    return !!(
      startDate &&
      !endDate &&
      differenceInMinutes(new Date(), new Date(startDate)) >
        TIMEOUT_WAIT_IN_MINUTES
    );
  }, [itemInternal.latestResult.startDate, itemInternal.latestResult.endDate]);

  if (!item) {
    return {
      timedOut: false,
      isInProgress: false,
      successfulItems: [],
      failedItems: [],
      allFailed: false,
      pctOfSuccess: 0
    };
  }

  const isInProgress =
    !timedOut && item.latestResult.logs.length !== item.iterations;

  const successfulItems = item.latestResult.logs.filter((log) => !log.failed);

  const failedItems = item.latestResult.logs.filter((log) => log.failed);

  const allFailed = failedItems.length === item.iterations;

  const pctOfSuccess = (successfulItems.length * 100) / item.iterations;

  return {
    timedOut,
    isInProgress,
    successfulItems,
    failedItems,
    allFailed,
    pctOfSuccess
  };
};
