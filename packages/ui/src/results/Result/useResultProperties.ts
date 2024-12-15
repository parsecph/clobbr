import differenceInMinutes from 'date-fns/differenceInMinutes';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { ClobbrUIResultState, UI_RESULT_STATES } from 'models/ClobbrUIResult';

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

export const isResultInProgress = ({
  isPartiallyComplete,
  logs,
  iterations
}: {
  isPartiallyComplete: boolean;
  logs: Array<any>;
  iterations: number;
}) => {
  return !isPartiallyComplete && logs.length !== iterations;
};

export const isResultPartiallyComplete = ({
  resultState
}: {
  resultState?: ClobbrUIResultState;
}) => {
  return resultState === UI_RESULT_STATES.PARTIALLY_COMPLETED;
};

export const useResultProperties = ({ item }: { item?: ClobbrUIListItem }) => {
  if (!item) {
    return {
      isInProgress: false,
      successfulItems: [],
      failedItems: [],
      allFailed: false,
      pctOfSuccess: 0
    };
  }

  const isPartiallyComplete = isResultPartiallyComplete({
    resultState: item.state
  });

  const isInProgress = isResultInProgress({
    logs: item.logs,
    iterations: item.iterations,
    isPartiallyComplete
  });

  const successfulItems = item.logs.filter((log) => !log.failed);

  const failedItems = item.logs.filter((log) => log.failed);

  const allFailed = failedItems.length === item.iterations;

  const pctOfSuccess = (successfulItems.length * 100) / item.iterations;

  return {
    isInProgress,
    isPartiallyComplete,
    successfulItems,
    failedItems,
    allFailed,
    pctOfSuccess
  };
};
