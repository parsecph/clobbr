import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export const useCommonlyFailedMessage = ({
  logs
}: {
  logs: Array<ClobbrLogItem>;
}) => {
  return {
    message: logs
      .filter(({ failed }) => failed)
      .sort(
        (a, b) =>
          logs.filter(({ error }) => error?.message === a.error?.message)
            .length -
          logs.filter(({ error }) => error?.message === b.error?.message).length
      )
      .pop()?.error?.message
  };
};
