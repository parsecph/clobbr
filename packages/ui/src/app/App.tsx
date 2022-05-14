import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from 'shared/theme';

import { DEFAULT_GLOBAL_STORE, GlobalStore } from './globalContext';
import { useClobbrState } from 'state/useClobbrState';
import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';

import Search from 'search/Search/Search';
import ResultList from 'results/ResultList/ResultList';
import Intro from 'Intro/Intro';
import ThemeToggle from 'ThemeToggle/ThemeToggle';
import ThemeLoader from 'shared/components/ThemeLoader/ThemeLoader';
import Topbar from 'Topbar/Topbar';
import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';

const App = () => {
  const [resultStorageLoaded, setResultStorageLoaded] = useState(false);
  const [preferencesApplied, setPreferencesApplied] = useState(false);
  const [themeMode, setThemeMode] = useState(DEFAULT_GLOBAL_STORE.themeMode);
  const { preferences, preferencesLoaded } = useStoredPreferences();

  const { state } = useClobbrState({ initialState: DEFAULT_GLOBAL_STORE });

  const storedResultState = useAsync(async () => {
    const resultDb = getDb(EDbStores.RESULT_STORE_NAME);
    const existingResultList = await resultDb.getItem(SK.RESULT.LIST);

    return existingResultList;
  });

  // Result state
  useEffect(() => {
    if (resultStorageLoaded || storedResultState.loading) {
      return;
    }

    if (storedResultState.value) {
      state.results.setList(storedResultState.value);
    }

    setResultStorageLoaded(true);
  }, [resultStorageLoaded, storedResultState, state]);

  // Result updates

  useEffect(() => {
    if (!resultStorageLoaded) {
      return;
    }

    const resultDb = getDb(EDbStores.RESULT_STORE_NAME);
    resultDb.setItem(SK.RESULT.LIST, state.results.list);
  }, [resultStorageLoaded, state.results.list]);

  // Theme state
  useEffect(() => {
    if (preferencesApplied || !preferencesLoaded) {
      return;
    }

    if (preferences) {
      if (preferences.themeMode) {
        setThemeMode(preferences.themeMode);
      }
    }

    setPreferencesApplied(true);
  }, [preferences, preferencesApplied, preferencesLoaded]);

  useEffect(() => {
    setThemeMode(state.themeMode);
  }, [state.themeMode]);

  return (
    <GlobalStore.Provider value={state}>
      <ThemeLoader />
      <ThemeProvider theme={getTheme(themeMode)}>
        {/* NB: needed to set theme. might want to break this into ThemeLoader & Toggle */}
        <CssBaseline />

        <Topbar />

        <main className="flex flex-col items-center justify-center h-full transition-all">
          <Search />

          {resultStorageLoaded ? (
            <section className="w-full">
              <ResultList list={state.results.list} />
              {/* <Intro /> */}
            </section>
          ) : (
            ''
          )}
        </main>

        {themeMode}
        <ThemeToggle />
      </ThemeProvider>
    </GlobalStore.Provider>
  );
};

export default App;
