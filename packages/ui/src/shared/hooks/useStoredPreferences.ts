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

    return { theme, stickySearch, maxIterations, showTrendline };
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
        showTrendline: storedPreferences.value.showTrendline
      });
    }

    setPreferencesLoaded(true);
  }, [preferencesLoaded, storedPreferences]);

  return {
    preferencesLoaded,
    preferences
  };
};
