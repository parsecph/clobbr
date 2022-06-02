import { useState } from 'react';

export const useAppSettingsState = ({
  initialState
}: {
  [key: string]: any;
}) => {
  const [settings, setSettings] = useState(initialState.appSettings);

  const toggleStickySearch = () => {
    const nextSettings = {
      ...settings,
      stickySearch: !settings.stickySearch
    };

    setSettings(nextSettings);
  };

  const setStickySearch = (stickySearch: boolean) => {
    const nextSettings = {
      ...settings,
      stickySearch
    };

    setSettings(nextSettings);
  };

  const appSettingsState = {
    ...settings,
    setStickySearch,
    toggleStickySearch
  };

  return {
    appSettingsState
  };
};
