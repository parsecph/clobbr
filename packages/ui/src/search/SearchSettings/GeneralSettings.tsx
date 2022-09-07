import { useContext, useState } from 'react';
import { isNumber } from 'lodash-es';

import {
  Typography,
  TextField,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
  Snackbar,
  IconButton,
  FormControl
} from '@mui/material';
import { Close } from '@mui/icons-material';

import { GlobalStore } from 'app/globalContext';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';
import IterationsInput from 'search/Search/IterationsInput';

export const GeneralSettings = () => {
  const globalStore = useContext(GlobalStore);

  const [confirmedSetSettingsToDefault, setConfirmedSetSettingsToDefault] =
    useState(false);
  const [settingsToDefaultToastShown, setSettingsToDefaultToastShown] =
    useState(false);

  const setSettingsToDefault = () => {
    globalStore.search.resetSettingsToDefault();
    setConfirmedSetSettingsToDefault(false);
    setSettingsToDefaultToastShown(true);
  };

  const dismissToast = () => setSettingsToDefaultToastShown(false);

  const handleTimeoutChange =
    (updateTimeout: (timeout: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.target.value, 10);
      if (!event.target.value || isNaN(numericValue) || numericValue < 0) {
        updateTimeout(0);
      } else if (isNumber(numericValue)) {
        updateTimeout(numericValue);
      }
    };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <>
          <Typography variant="overline" className={'opacity-50'}>
            General settings
          </Typography>

          <div className="flex flex-col gap-6 mt-6">
            <FormGroup>
              <FormControlLabel
                control={
                  <AppleSwitch
                    onChange={search.toggleParallel}
                    checked={search.parallel}
                  />
                }
                label="Send requests in parallel"
              />
            </FormGroup>

            <IterationsInput />

            <TextField
              variant="outlined"
              label="Request timeout (ms)"
              placeholder="10000"
              id="timeout"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={search.timeout}
              onChange={handleTimeoutChange(search.updateTimeout)}
            />

            <FormControl
              component="fieldset"
              variant="standard"
              className="flex flex-col gap-2"
            >
              <Typography variant="overline" className={'opacity-50'}>
                Actions
              </Typography>

              {confirmedSetSettingsToDefault ? (
                <div className="flex flex-col gap-2">
                  <Typography variant="caption" className="inline-block w-full">
                    Are you sure? This will also reset headers & data settings
                    for the current url.
                  </Typography>

                  <div className="flex gap-2">
                    <Button onClick={setSettingsToDefault} color="secondary">
                      Reset to default
                    </Button>

                    <Button
                      onClick={() => setConfirmedSetSettingsToDefault(false)}
                      color="secondary"
                      variant="text"
                    >
                      <span className="text-gray-900 dark:text-gray-100">
                        Cancel
                      </span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Button
                    onClick={() => setConfirmedSetSettingsToDefault(true)}
                    color="secondary"
                  >
                    Reset to default
                  </Button>
                </div>
              )}
            </FormControl>
          </div>

          <Snackbar
            open={settingsToDefaultToastShown}
            autoHideDuration={6000}
            onClose={dismissToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            className="pointer-events-none"
          >
            <Alert
              className="bg-green-200/80 dark:bg-emerald-900/80 backdrop-blur-sm mb-10 pointer-events-auto"
              onClose={dismissToast}
              severity="success"
              icon={false}
              sx={{ width: '100%' }}
              action={
                <IconButton
                  aria-label="Dismiss"
                  onClick={dismissToast}
                  color="inherit"
                  className="!mb-1"
                >
                  <Close />
                </IconButton>
              }
            >
              <p className="flex h-full items-center">
                Settings reset to default.
              </p>
            </Alert>
          </Snackbar>
        </>
      )}
    </GlobalStore.Consumer>
  );
};
