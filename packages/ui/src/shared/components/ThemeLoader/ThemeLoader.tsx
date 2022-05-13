import { useEffect, useContext, useState } from 'react';

import { GlobalStore } from 'App/globalContext';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
import { getDb } from 'storage/storage';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

const ThemeToggle = () => {
  const globalStore = useContext(GlobalStore);

  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  useEffect(() => {
    document.body.classList[
      globalStore.themeMode === 'dark' ? 'add' : 'remove'
    ]('dark');
  }, [globalStore.themeMode]);

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

  return <></>;
};

export default ThemeToggle;
