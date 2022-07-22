import { useContext } from 'react';
import { Button, Typography } from '@mui/material';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { GlobalStore } from 'App/globalContext';
import { SEARCH_SETTINGS_MODE } from 'shared/enums/ESearchSettingsMode';

export const UpdateSettingsButton = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const globalStore = useContext(GlobalStore);

  const updateSettings = () => {
    globalStore.search.setSettings(item);
    globalStore.search.showSettingsModal(SEARCH_SETTINGS_MODE.EDIT);
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <Button
          onClick={updateSettings}
          color={themeMode === 'dark' ? 'primary' : 'secondary'}
          component="a"
          variant="outlined"
          href="#"
          className="!px-6 h-11"
        >
          <Typography variant="body2">Update Settings</Typography>
        </Button>
      )}
    </GlobalStore.Consumer>
  );
};
