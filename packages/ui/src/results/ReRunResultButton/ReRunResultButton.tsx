import { Button, Typography, CircularProgress } from '@mui/material';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { GlobalStore } from 'App/globalContext';

import { useResultRunner } from 'results/useResultRunner';

export const ReRunResultButton = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const { startRun, requestsInProgress, wsReady } = useResultRunner({
    requestUrl: item.url,
    parallel: item.parallel,
    iterations: item.iterations,
    verb: item.verb,
    ssl: item.ssl,
    dataJson: item.data,
    headerItems: item.headers,
    headerInputMode: item.headerInputMode,
    headerShellCmd: item.headerShellCmd,
    headerNodeScriptData: item.headerNodeScriptData,
    timeout: item.timeout
  });

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <Button
          onClick={startRun}
          color={themeMode === 'dark' ? 'primary' : 'secondary'}
          component="a"
          variant="outlined"
          href="#"
          className="!px-6 h-11"
          disabled={requestsInProgress || !wsReady}
        >
          {requestsInProgress ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant="body2">Run again</Typography>
          )}
        </Button>
      )}
    </GlobalStore.Consumer>
  );
};
