import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';

import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';

export type Preferences = {
  themeMode?: string;
  stickySearch?: boolean;
  maxIterations?: number;
  showTrendline?: boolean;
  showBarCharts?: boolean;
};

export const useStoredPreferences = () => {
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({});

  const storedPreferences = useAsync(async () => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    const theme = await resultDb.getItem(SK.PREFERENCES.THEME);
    const stickySearch = await resultDb.getItem(SK.PREFERENCES.STICKY_SEARCH);
    const maxIterations = await resultDb.getItem(SK.PREFERENCES.MAX_ITERATIONS);
    const showTrendline = await resultDb.getItem(SK.PREFERENCES.SHOW_TRENDLINE);
    const showBarCharts = await resultDb.getItem(
      SK.PREFERENCES.SHOW_BAR_CHARTS
    );

    return { theme, stickySearch, maxIterations, showTrendline, showBarCharts };
  });

  useEffect(() => {
    if (preferencesLoaded || storedPreferences.loading) {
      return;
    }

    if (storedPreferences.value) {
      setPreferences({
        themeMode: storedPreferences.value.theme,
        stickySearch: storedPreferences.value.stickySearch,
        maxIterations: storedPreferences.value.maxIterations,
        showTrendline: storedPreferences.value.showTrendline,
        showBarCharts: storedPreferences.value.showBarCharts
      });
    }

    setPreferencesLoaded(true);
  }, [preferencesLoaded, storedPreferences]);

  return {
    preferencesLoaded,
    preferences
  };
};
