import { useSearchState } from './useSearchState';
import { useThemeState } from './useThemeState';
import { useResultState } from './useResultState';

export const useClobbrState = ({ initialState }: { [key: string]: any }) => {
  const { themeState } = useThemeState({ initialState });
  const { searchState } = useSearchState({ initialState });
  const { resultState } = useResultState({ initialState });

  const globalStateValue = {
    ...initialState,
    ...themeState,
    search: { ...searchState },
    results: { ...resultState }
  };

  (window as any).state = globalStateValue;

  return {
    state: globalStateValue
  };
};
