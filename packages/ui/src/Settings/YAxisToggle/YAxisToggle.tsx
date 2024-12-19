import { useEffect, useContext, useState } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'app/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const YAxisToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(
      SK.PREFERENCES.SHOW_Y_AXIS,
      globalStore.appSettings.showYAxis
    );
  }, [globalStore.appSettings.showYAxis]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.showYAxis) {
        globalStore.appSettings.setShowYAxis(preferences.showYAxis);
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
                onChange={appSettings.toggleShowYAxis}
                checked={appSettings.showYAxis}
              />
            }
            label="Show chart labels (Y-Axis)"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default YAxisToggle;
