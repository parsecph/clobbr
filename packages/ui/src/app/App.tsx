import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAsync, useMount } from 'react-use';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from 'shared/theme';
import { mediaQueries } from 'shared/mediaQueries';
import Portal from '@mui/base/Portal';

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
import { ToastContainer } from 'toasts/toastContainer';

import { useStoredPreferences } from 'shared/hooks/useStoredPreferences';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { useToastStore } from 'toasts/state/toastStore';
import {
  isResultInProgress,
  isResultPartiallyComplete
} from 'results/Result/useResultProperties';
import { UI_RESULT_STATES } from 'models/ClobbrUIResult';

const App = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const topbarDom = useRef(null);
  const searchDom = useRef(null);

  const isXl = useMediaQuery({
    query: `(min-width: ${mediaQueries.xl}px)`
  });

  const is2xl = useMediaQuery({
    query: `(min-width: ${mediaQueries['2xl']}px)`
  });

  const is3xl = useMediaQuery({
    query: `(min-width: ${mediaQueries['3xl']}px)`
  });

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
    (item: ClobbrUIListItem) =>
      item.listItemId === state.results.expandedResults[0]
  );

  // Result state
  useEffect(() => {
    if (resultStorageLoaded || storedResultState.loading) {
      return;
    }

    if (storedResultState.value) {
      try {
        // Update unfinised results & set them to partially finished.
        const resultList = storedResultState.value.map(
          (item: ClobbrUIListItem) => {
            const isPartiallyComplete = isResultPartiallyComplete({
              resultState: item.latestResult.state
            });

            const isInProgress = isResultInProgress({
              logs: item.latestResult.logs,
              iterations: item.latestResult.iterations,
              isPartiallyComplete
            });

            if (isInProgress) {
              item.latestResult.state = UI_RESULT_STATES.PARTIALLY_COMPLETED;
            }

            return item;
          }
        );

        state.results.setList(resultList);
      } catch (error) {
        console.error(error);
      }
    }

    setResultStorageLoaded(true);
  }, [resultStorageLoaded, storedResultState, state]);

  // Result updates
  useEffect(() => {
    if (!resultStorageLoaded) {
      return;
    }

    // NB: this could be optimized to not store all history items with each write.
    // Might be a issue as data piles up.
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
    setTimeout(() => {
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
    }, 800); // HACK: ensure topbar animation has been completed to get correct height
  });

  const dbStorage = useMemo(
    () => ({
      getItem(name: string) {
        try {
          const existingPref = localStorage.getItem(
            SK.PREFERENCES.PANELS.MAIN_LAYOUT
          );
          const parsed = existingPref ? JSON.parse(existingPref) : {};
          const value = parsed[name] || '';

          if (value) {
            return value;
          } else {
            let minWidth = 448;

            if (is2xl) {
              minWidth = 512;
            }

            if (is3xl) {
              minWidth = 576;
            }

            const widthPercentage = (minWidth * 100) / window.innerWidth;
            const flexValues = {
              '10': [100],
              '10,10': [widthPercentage, 100 - widthPercentage]
            };

            return JSON.stringify(flexValues);
          }
        } catch (error) {
          console.error(error);
          return '';
        }
      },

      setItem(name: string, value: string) {
        try {
          const encoded = JSON.stringify({
            [name]: value
          });

          localStorage.setItem(SK.PREFERENCES.PANELS.MAIN_LAYOUT, encoded);
        } catch (error) {
          console.error(error);
        }
      }
    }),
    [is2xl, is3xl]
  );

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
            <PanelGroup
              autoSaveId="mainLayout"
              direction="horizontal"
              className="contents xl:flex xl:flex-row-reverse xl:w-full xl:justify-end xl:border-t border-gray-100 dark:border-opacity-30 dark:border-gray-700"
              style={
                isXl
                  ? {
                      height: `calc(100vh - ${topbarHeight}px)`
                    }
                  : {}
              }
              storage={dbStorage}
            >
              <Panel className="w-full h-full min-w-[400px]">
                <div className="flex h-full overflow-auto">
                  <ResultList list={state.results.list} className="w-full" />
                </div>
              </Panel>

              <MediaQuery minWidth={mediaQueries.xl}>
                <PanelResizeHandle className="group w-4 bg-gray-200 dark:bg-zinc-800/70 hover:bg-zinc-300/80 dark:hover:bg-zinc-900/100 opacity-100 hover:opacity-100 transition-all flex items-center justify-center">
                  <DragIndicatorIcon
                    aria-label="Resize panel"
                    className="!w-5 opacity-50 group-hover:opacity-100 transition-all"
                  />
                </PanelResizeHandle>

                <Panel className="w-full flex min-w-[600px]">
                  {expandedResult ? (
                    <div className="sticky top-0 overflow-auto w-full pt-12 bg-gray-100 dark:bg-gray-700/30">
                      <ResultContent item={expandedResult} expanded={true} />
                    </div>
                  ) : (
                    <div className="sticky top-0 overflow-auto w-full flex items-center justify-center pt-12 bg-gray-100 dark:bg-gray-600/30">
                      <NoResultSelected />
                    </div>
                  )}
                </Panel>
              </MediaQuery>
            </PanelGroup>
          ) : (
            ''
          )}
        </main>

        <Portal>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </Portal>
      </ThemeProvider>
    </GlobalStore.Provider>
  );
};

export default App;
