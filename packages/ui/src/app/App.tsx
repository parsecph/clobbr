import MediaQuery from 'react-responsive';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useAsync } from 'react-use';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from 'shared/theme';
import { mediaQueries } from 'shared/mediaQueries';

import { DEFAULT_GLOBAL_STORE, GlobalStore } from './globalContext';
import { useClobbrState } from 'state/useClobbrState';
import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';

import Search from 'search/Search/Search';
import ResultList from 'results/ResultList/ResultList';
import { NoResultSelected } from 'results/NoResultSelected/NoResultSelected';
import ResultContent from 'results/Result/ResultContent/ResultContent';
import PreferenceLoader from 'shared/components/PreferenceLoader/PreferenceLoader';
import Topbar from 'Topbar/Topbar';

import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

const App = () => {
  const topbarDom = useRef(null);
  const searchDom = useRef(null);
  const [topbarHeight, setTopbarHeight] = useState(0);
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

  const expandedResult = state.results.list.find(
    (item: ClobbrUIResultListItem) =>
      item.id === state.results.expandedResults[0]
  );

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const topbarElement = topbarDom?.current
      ? (topbarDom.current as HTMLElement)
      : null;
    const searchElement = searchDom?.current
      ? (searchDom.current as HTMLElement)
      : null;
    const topbarHeight = topbarElement
      ? topbarElement.offsetHeight +
        parseFloat(getComputedStyle(topbarElement).marginBottom) +
        parseFloat(getComputedStyle(topbarElement).marginTop)
      : 0;
    const searchHeight = searchElement
      ? searchElement.offsetHeight +
        parseFloat(getComputedStyle(searchElement).marginBottom) +
        parseFloat(getComputedStyle(searchElement).marginTop)
      : 0;

    setTopbarHeight(topbarHeight + searchHeight);
  });

  return (
    <GlobalStore.Provider value={state}>
      <PreferenceLoader />
      <ThemeProvider theme={getTheme(themeMode)}>
        <CssBaseline />

        <Topbar ref={topbarDom} />

        <main
          className={clsx(
            'flex flex-col items-center justify-center h-full transition-all',
            // 'xl:bg-gray-200 xl:dark:bg-zinc-900/40',
            state.results.list.length === 0 ? ' flex-grow' : 'flex-grow-0'
          )}
        >
          <Search ref={searchDom} />

          {resultStorageLoaded && state.results.list.length > 0 ? (
            <div
              className="contents xl:flex xl:flex-row-reverse xl:w-full xl:justify-end xl:border-t border-gray-100 dark:border-opacity-30 dark:border-gray-700"
              style={{
                height: `calc(100vh - ${topbarHeight}px)`
              }}
            >
              <MediaQuery minWidth={mediaQueries.xl}>
                {expandedResult ? (
                  <div className="sticky top-0 overflow-auto w-full pt-12 bg-gray-100 dark:bg-opacity-30 dark:bg-gray-700">
                    <ResultContent item={expandedResult} expanded={true} />
                  </div>
                ) : (
                  <div className="sticky top-0 overflow-auto w-full flex items-center justify-center pt-12 bg-gray-100 dark:bg-opacity-30 dark:bg-gray-700">
                    <NoResultSelected />
                  </div>
                )}
              </MediaQuery>

              <section className="w-full xl:max-w-md 2xl:max-w-lg 3xl:max-w-xl xl:overflow-auto flex-grow-1 flex-shrink-0 lg:flex">
                <ResultList list={state.results.list} className="w-full" />
              </section>
            </div>
          ) : (
            ''
          )}
        </main>
      </ThemeProvider>
    </GlobalStore.Provider>
  );
};

export default App;
