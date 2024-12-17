import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash-es';

const findMessage = (logs: Array<ClobbrLogItem>) => {
  const isString = (value: unknown): value is string => {
    return typeof value === 'string';
  };

  const firstError = logs
    .filter(({ failed }) => failed)
    .slice(0, 100)
    .sort((a, b) => {
      const aMessage = isString(a.error) ? a.error : a.error?.message;
      const bMessage = isString(b.error) ? b.error : b.error?.message;

      return (
        logs.filter(({ error }) =>
          isString(error) ? error : error?.message === aMessage
        ).length -
        logs.filter(({ error }) =>
          isString(error) ? error : error?.message === bMessage
        ).length
      );
    })
    .pop();

  if (!firstError) {
    return '';
  }

  return isString(firstError.error)
    ? firstError.error
    : firstError.error?.message;
};

export const useCommonlyFailedMessage = ({
  logs
}: {
  logs: Array<ClobbrLogItem>;
}) => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const throttledFindMessage = throttle(() => {
      const result = findMessage(logs);
      setMessage(result || '');
    }, 1000);

    throttledFindMessage();

    return () => {
      throttledFindMessage.cancel();
    };
  }, [logs]);

  return {
    message
  };
};
