import differenceInMinutes from 'date-fns/differenceInMinutes';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

const TIMEOUT_WAIT_IN_MINUTES = 3;

export const isResultTimeout = ({
  startDate,
  endDate
}: {
  startDate: string;
  endDate?: string | Date;
}): boolean => {
  return !!(
    startDate &&
    !endDate &&
    differenceInMinutes(new Date(), new Date(startDate)) >
      TIMEOUT_WAIT_IN_MINUTES
  );
};

export const isResultPartiallyComplete = ({
  item
}: {
  item: ClobbrUIListItem;
}) => {
  return item.iterations > item.logs.length;
};

export const useResultProperties = ({ item }: { item?: ClobbrUIListItem }) => {
  if (!item) {
    return {
      successfulItems: [],
      failedItems: [],
      allFailed: false,
      pctOfSuccess: 0,
      progressStats: 0
    };
  }

  const isPartiallyComplete = isResultPartiallyComplete({
    item
  });

  const successfulItems = item.logs.filter((log) => !log.failed);

  const failedItems = item.logs.filter((log) => log.failed);

  const allFailed = failedItems.length === item.iterations;

  const pctOfSuccess = (successfulItems.length * 100) / item.iterations;

  const pctOfProgress = Math.floor((item.logs.length * 100) / item.iterations);

  return {
    isPartiallyComplete,
    successfulItems,
    failedItems,
    allFailed,
    pctOfSuccess,
    pctOfProgress
  };
};
