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

  const setTheme = (mode: string) => {
    setThemeMode(mode);
  };

  const themeState = {
    toggleTheme,
    setTheme,
    themeMode
  };

  return {
    themeState
  };
};
