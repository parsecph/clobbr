import { useEffect, useContext } from 'react';

import { FormControlLabel, FormGroup } from '@mui/material';
import { GlobalStore } from 'App/globalContext';
import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

const ThemeToggle = () => {
  const globalStore = useContext(GlobalStore);

  useEffect(() => {
    document.body.classList[
      globalStore.themeMode === 'dark' ? 'add' : 'remove'
    ]('dark');
  }, [globalStore.themeMode]);

  return (
    <GlobalStore.Consumer>
      {({ toggleTheme, themeMode }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <AppleSwitch
                onChange={toggleTheme}
                checked={themeMode === 'dark'}
              />
            }
            label="Toggle dark theme"
          />
        </FormGroup>
      )}
    </GlobalStore.Consumer>
  );
};

export default ThemeToggle;
