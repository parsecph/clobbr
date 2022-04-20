import { useState } from 'react';

export const useThemeState = ({ initialState }: { [key: string]: any }) => {
  const [themeMode, setThemeMode] = useState(initialState.themeMode);

  const toggleTheme = () => {
    if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  const themeState = {
    toggleTheme,
    themeMode
  };

  return {
    themeState
  };
};
