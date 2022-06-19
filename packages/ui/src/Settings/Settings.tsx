import { isNumber } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { useAsyncFn, useMount, useInterval, useUnmount } from 'react-use';
import byteSize from 'byte-size';

import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { GlobalStore } from 'App/globalContext';
import { SK } from 'storage/storageKeys';
import { MAX_ITERATIONS } from 'shared/consts/settings';

import {
  Alert,
  FormControl,
  Typography,
  Button,
  Snackbar,
  IconButton,
  TextField
} from '@mui/material';
import { Close } from '@mui/icons-material';

import ThemeToggle from 'Settings/ThemeToggle/ThemeToggle';
import StickySearchToggle from 'Settings/StickySearchToggle/StickySearchToggle';

export const Settings = () => {
  const globalStore = useContext(GlobalStore);

  const [confirmedClearing, setConfirmedClearing] = useState(false);
  const [databaseCleared, setDatabaseCleared] = useState(false);

  const handleMaxIterationCHange =
    (updateMaxIterations: (iterations: number | '') => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.target.value, 10);
      if (!event.target.value || isNaN(numericValue) || numericValue < 0) {
        updateMaxIterations('');
      } else if (isNumber(numericValue)) {
        updateMaxIterations(numericValue);
      }
    };

  const dismissToast = () => setDatabaseCleared(false);

  const clearLocalData = async () => {
    globalStore.results.setList([]);
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    await resultDb.clear();

    setDatabaseCleared(true);
    setConfirmedClearing(false);
  };

  const [storedDataSize, calculateStoredDataSize] = useAsyncFn(async () => {
    const estimate = (await navigator.storage.estimate()) as {
      usageDetails: { indexedDB?: number };
    };

    const indexedDbSize = estimate.usageDetails.indexedDB;

    if (!indexedDbSize) {
      return null;
    }

    try {
      const size = byteSize(indexedDbSize);
      return `${size.value} ${size.unit}`;
    } catch (error) {
      console.error('Failed to get indexedDB size', error);
      return null;
    }
  });

  // Calculate stored data every 3000ms
  useInterval(() => {
    calculateStoredDataSize();
  }, 3000);

  useMount(() => {
    calculateStoredDataSize();
  });

  // Store maxIterations when it changes
  useEffect(() => {
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    resultDb.setItem(
      SK.PREFERENCES.MAX_ITERATIONS,
      globalStore.appSettings.maxIterations
    );
  }, [globalStore.appSettings.maxIterations]);

  // Update set iterations on unMount to account for iterations already set exceeding maximum.
  useUnmount(() => {
    const maxIterationCount = isNumber(globalStore.appSettings.maxIterations)
      ? globalStore.appSettings.maxIterations
      : MAX_ITERATIONS;

    if (globalStore.search.iterations > maxIterationCount) {
      globalStore.search.updateIterations(maxIterationCount);
    }
  });

  return (
    <GlobalStore.Consumer>
      {({ appSettings }) => (
        <div className="flex flex-col gap-12 p-6">
          <FormControl
            component="fieldset"
            variant="standard"
            className="flex flex-col gap-2"
          >
            <Typography variant="overline" className={'opacity-50'}>
              Appearance settings
            </Typography>

            <ThemeToggle />
            <StickySearchToggle />
          </FormControl>

          <FormControl
            component="fieldset"
            variant="standard"
            className="flex flex-col gap-2"
          >
            <Typography variant="overline" className={'opacity-50'}>
              Local data management
            </Typography>

            <div>
              {confirmedClearing ? (
                <div className="flex flex-col gap-2">
                  <Typography variant="caption" className="inline-block w-full">
                    Are you sure? There is no going back.
                  </Typography>

                  <div className="flex gap-2">
                    <Button onClick={clearLocalData} color="error">
                      Clear data
                    </Button>

                    <Button
                      onClick={() => setConfirmedClearing(false)}
                      color="secondary"
                      variant="text"
                      disabled={databaseCleared}
                    >
                      <span className="text-gray-900 dark:text-gray-100">
                        Cancel
                      </span>
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setConfirmedClearing(true)}
                  color="error"
                  disabled={databaseCleared}
                >
                  Clear result data
                </Button>
              )}
            </div>

            {storedDataSize.value ? (
              <Typography variant="caption" className={'opacity-50'}>
                <span className="font-semibold">
                  About {storedDataSize.value}
                </span>{' '}
                used
              </Typography>
            ) : (
              <></>
            )}
          </FormControl>

          <FormControl
            component="fieldset"
            variant="standard"
            className="flex flex-col gap-2"
          >
            <Typography variant="overline" className={'opacity-50'}>
              Advanced settings
            </Typography>

            <TextField
              variant="outlined"
              label="Maximum allowed iterations"
              placeholder="i.e. 100"
              id="maxIterations"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={appSettings.maxIterations}
              helperText={`Defaults to ${MAX_ITERATIONS}`}
              onChange={handleMaxIterationCHange(appSettings.setMaxIterations)}
            />
            {appSettings.maxIterations && appSettings.maxIterations > 100 ? (
              <Alert severity="warning">
                Keep in mind that your operating system might throttle sending
                these many requests in parallel. <br />
                Generally, around 100 requests should give you a good idea of
                the performance of an endpoint.
              </Alert>
            ) : (
              <></>
            )}
          </FormControl>

          <Snackbar
            open={databaseCleared}
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
                Local result data cleared
              </p>
            </Alert>
          </Snackbar>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
