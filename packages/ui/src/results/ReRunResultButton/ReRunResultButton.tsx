import { useContext } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { GlobalStore } from 'app/globalContext';

import { useResultRunner } from 'results/useResultRunner';

export const ReRunResultButton = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const globalStore = useContext(GlobalStore);

  const { startRun } = useResultRunner({
    requestUrl: item.url,
    parallel: item.parallel,
    iterations: item.iterations,
    verb: item.verb,
    ssl: item.ssl,
    dataJson: item.data,
    properties: item.properties,
    headerItems: item.headers,
    headerInputMode: item.headerInputMode,
    headerShellCmd: item.headerShellCmd,
    headerNodeScriptData: item.headerNodeScriptData,
    timeout: item.timeout
  });

  const reRunResult = () => {
    globalStore.search.setSettings(item);
    startRun();
  };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <Button
          onClick={reRunResult}
          color="primary"
          component="a"
          href="#"
          className="!px-6 h-11"
          disabled={search.inProgress || !search.wsReady}
        >
          {search.inProgress ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant="body2">Run again</Typography>
          )}
        </Button>
      )}
    </GlobalStore.Consumer>
  );
};
