import { useSearchState } from './useSearchState';
import { useThemeState } from './useThemeState';
import { useResultState } from './useResultState';
import { useAppSettingsState } from './useAppSettingsState';

export const useClobbrState = ({ initialState }: { [key: string]: any }) => {
  const { themeState } = useThemeState({ initialState });
  const { searchState } = useSearchState({ initialState });
  const { resultState } = useResultState({ initialState });
  const { appSettingsState } = useAppSettingsState({ initialState });

  const globalStateValue = {
    ...initialState,
    ...themeState,
    search: { ...searchState },
    results: { ...resultState },
    appSettings: { ...appSettingsState }
  };

  (window as any).state = globalStateValue;

  return {
    state: globalStateValue
  };
};
