import { useState } from 'react';

export const useAppSettingsState = ({
  initialState
}: {
  [key: string]: any;
}) => {
  const [stickySearch, setStickySearch] = useState(initialState.stickySearch);
  const [maxIterations, setMaxIterations] = useState(
    initialState.maxIterations
  );

  const toggleStickySearch = () => {
    setStickySearch(!stickySearch);
  };

  const appSettingsState = {
    stickySearch,
    setStickySearch,
    toggleStickySearch,
    maxIterations,
    setMaxIterations
  };

  return {
    appSettingsState
  };
};
