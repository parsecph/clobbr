import { useEffect, useContext, useState } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'App/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const ThemeToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(SK.PREFERENCES.THEME, globalStore.themeMode);
  }, [globalStore.themeMode]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.themeMode) {
        globalStore.setTheme(preferences.themeMode);
      }
    }

    setPreferencesApplied(true);
  }, [preferences, preferencesApplied, preferencesLoaded, globalStore]);

  return (
    <GlobalStore.Consumer>
      {({ toggleTheme, themeMode }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <AppleSwitch
                onChange={toggleTheme}
                checked={themeMode === 'dark'}
              />
            }
            label="Toggle dark theme"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default ThemeToggle;
