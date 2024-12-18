import { useEffect, useContext, useState } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'app/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const CollectResponseDataToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  const onChange = (_newValue: React.ChangeEvent<HTMLInputElement>) => {
    globalStore.results.updateExpandedResults([]);
    globalStore.results.updateExpandedResultGroups([]);
    globalStore.appSettings.toggleCollectResponseData();
  };

  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(
      SK.PREFERENCES.COLLECT_RESPONSE_DATA,
      globalStore.appSettings.collectResponseData
    );
  }, [globalStore.appSettings.collectResponseData]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.collectResponseData) {
        globalStore.appSettings.setCollectResponseData(
          preferences.collectResponseData
        );
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
                onChange={onChange}
                checked={appSettings.collectResponseData}
              />
            }
            label="Collect response data"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default CollectResponseDataToggle;
