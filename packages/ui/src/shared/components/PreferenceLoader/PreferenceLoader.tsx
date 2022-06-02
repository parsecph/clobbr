import { useEffect, useContext, useState } from 'react';

import { GlobalStore } from 'App/globalContext';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';
import { isBoolean, isNumber } from 'lodash-es';

const PreferenceLoader = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    document.body.classList[
      globalStore.themeMode === 'dark' ? 'add' : 'remove'
    ]('dark');
  }, [globalStore.themeMode]);

  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.themeMode) {
        globalStore.setTheme(preferences.themeMode);
      }

      if (isBoolean(preferences.stickySearch)) {
        globalStore.appSettings.setStickySearch(preferences.stickySearch);
      }

      if (isNumber(preferences.maxIterations)) {
        globalStore.appSettings.setMaxIterations(preferences.maxIterations);
      }
    }

    setPreferencesApplied(true);
  }, [preferences, preferencesApplied, preferencesLoaded, globalStore]);

  return <></>;
};

export default PreferenceLoader;
