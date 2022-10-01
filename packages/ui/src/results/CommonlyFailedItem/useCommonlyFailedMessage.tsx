import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { isString } from 'lodash-es';

export const useCommonlyFailedMessage = ({
  logs
}: {
  logs: Array<ClobbrLogItem>;
}) => {
  const firstError = logs
    .filter(({ failed }) => failed)
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
    return { message: '' };
  }

  return {
    message: isString(firstError.error)
      ? firstError.error
      : firstError.error?.message
  };
};
