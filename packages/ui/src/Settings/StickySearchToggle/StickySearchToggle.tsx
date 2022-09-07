import { useEffect, useContext, useState } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'app/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const StickySearchToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(
      SK.PREFERENCES.STICKY_SEARCH,
      globalStore.appSettings.stickySearch
    );
  }, [globalStore.appSettings.stickySearch]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.stickySearch) {
        globalStore.appSettings.setStickySearch(preferences.stickySearch);
      }
    }

    setPreferencesApplied(true);
  }, [preferences, preferencesApplied, preferencesLoaded, globalStore]);

  return (
    <GlobalStore.Consumer>
      {({ appSettings }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <AppleSwitch
                onChange={appSettings.toggleStickySearch}
                checked={appSettings.stickySearch}
              />
            }
            label="Use 'sticky' search (search bar stays on screen while scrolling)"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default StickySearchToggle;
