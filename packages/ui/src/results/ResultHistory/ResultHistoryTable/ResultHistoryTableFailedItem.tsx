import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { isString } from 'lodash-es';
import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';

export const ResultHistoryTableFailedItem = ({
  log
}: {
  log: ClobbrLogItem;
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();

  const copyLogToClipboard = () => {
    copyToClipboard(JSON.stringify(log, null, 2));
  };

  const errorMessage = useCallback(() => {
    const message = isString(log.error) ? log.error : log.error?.message;
    return message || log.metas.status || 'Request failed';
  }, [log]);

  const statusCode = log.metas?.statusCode;

  return (
    <ButtonBase onClick={copyLogToClipboard} className="w-full">
      <Tooltip
        title={
          <>
            {errorMessage()} <br />
            <b>Press to copy error to clipboard.</b>
          </>
        }
      >
        <Typography
          variant="caption"
          className="uppercase flex items-center gap-0.5 w-full"
        >
          <small>
            {!state.error && !state.value ? (
              <>
                <span className="opacity-50">Fail</span>{' '}
                <span className="opacity-50 border-b border-red-500">
                  {statusCode ? ` ${statusCode}` : ''}
                </span>
              </>
            ) : (
              ''
            )}
            {state.error ? 'Error' : ''}
            {state.value ? 'Copied' : ''}
          </small>
        </Typography>
      </Tooltip>
    </ButtonBase>
  );
};
