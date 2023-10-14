import { useContext } from 'react';
import { Button, Typography } from '@mui/material';

import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

import { GlobalStore } from 'app/globalContext';
import { SEARCH_SETTINGS_MODE } from 'shared/enums/ESearchSettingsMode';

export const UpdateSettingsButton = ({ item }: { item: ClobbrUIListItem }) => {
  const globalStore = useContext(GlobalStore);

  const updateSettings = () => {
    globalStore.search.setSettings(item);
    globalStore.search.showSettingsModal(SEARCH_SETTINGS_MODE.EDIT);
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode, search }) => (
        <Button
          onClick={updateSettings}
          color={themeMode === 'dark' ? 'primary' : 'secondary'}
          component="a"
          variant="outlined"
          href="#"
          className="!px-6 h-11"
          disabled={search.inProgress}
        >
          <Typography variant="body2">Update Settings</Typography>
        </Button>
      )}
    </GlobalStore.Consumer>
  );
};
