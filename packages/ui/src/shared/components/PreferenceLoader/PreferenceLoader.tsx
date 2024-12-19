import { useEffect, useContext, useState } from 'react';

import { GlobalStore } from 'app/globalContext';
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

      if (isBoolean(preferences.showTrendline)) {
        globalStore.appSettings.setShowTrendline(preferences.showTrendline);
      }

      if (isBoolean(preferences.showBarCharts)) {
        globalStore.appSettings.setShowBarCharts(preferences.showBarCharts);
      }

      if (isBoolean(preferences.showYAxis)) {
        globalStore.appSettings.setShowYAxis(preferences.showYAxis);
      }
    }

    setPreferencesApplied(true);
  }, [preferences, preferencesApplied, preferencesLoaded, globalStore]);

  return <></>;
};

export default PreferenceLoader;
