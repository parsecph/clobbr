import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useWorker } from '@koale/useworker';
import { useEffect, useState } from 'react';

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
  const [findMessageWorker] = useWorker(findMessage);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const awaitMessage = async () => {
      const result = await findMessageWorker(logs);
      setMessage(result || '');
    };

    awaitMessage();
  }, [logs, findMessageWorker]);

  return {
    message
  };
};
