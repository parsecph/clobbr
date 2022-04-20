import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from 'shared/theme';

import { DEFAULT_GLOBAL_STORE, GlobalStore } from './globalContext';
import { useClobbrState } from 'state/useClobbrState';

import ActivityIndicator from 'ActivityIndicator/ActivityIndicator';
import Search from 'search/Search/Search';
import ResultList from 'results/ResultList/ResultList';
import Intro from 'Intro/Intro';
import ThemeToggle from 'ThemeToggle/ThemeToggle';
import Topbar from 'Topbar/Topbar';

const App = () => {
  const { state } = useClobbrState({ initialState: DEFAULT_GLOBAL_STORE });

  return (
    <GlobalStore.Provider value={state}>
      <ThemeProvider theme={getTheme(state.themeMode)}>
        <CssBaseline />

        <Topbar />

        <main className="flex flex-col items-center justify-center h-full transition-all">
          <Search />

          <section className="w-full">
            <ResultList list={state.results.list} />
            {/* <ActivityIndicator />


            <Intro /> */}
            <ThemeToggle />
          </section>
        </main>
      </ThemeProvider>
    </GlobalStore.Provider>
  );
};

export default App;
