import { useEffect, useContext, useState } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'app/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const BarChartToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(
      SK.PREFERENCES.SHOW_BAR_CHARTS,
      globalStore.appSettings.showBarCharts
    );
  }, [globalStore.appSettings.showBarCharts]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.showBarCharts) {
        globalStore.appSettings.setShowBarCharts(preferences.showBarCharts);
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
                onChange={appSettings.toggleShowBarCharts}
                checked={appSettings.showBarCharts}
              />
            }
            label="Use bar charts instead of line charts"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default BarChartToggle;
