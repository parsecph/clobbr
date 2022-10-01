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

  return (
    <ButtonBase onClick={copyLogToClipboard}>
      <Tooltip
        title={
          <>
            {errorMessage()} <br />
            <b>Press to copy error to clipboard.</b>
          </>
        }
      >
        <Typography variant="caption" className="uppercase opacity-50">
          {!state.error && !state.value ? 'Fail' : ''}
          {state.error ? 'Error' : ''}
          {state.value ? 'Copied' : ''}
        </Typography>
      </Tooltip>
    </ButtonBase>
  );
};
