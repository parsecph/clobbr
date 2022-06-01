import { useContext, useState } from 'react';
import { useAsyncFn, useMount, useInterval } from 'react-use';
import byteSize from 'byte-size';

import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { GlobalStore } from 'App/globalContext';

import {
  Alert,
  FormControl,
  Typography,
  Button,
  Snackbar,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

import ThemeToggle from 'ThemeToggle/ThemeToggle';

const version = require('../../package.json').version;

export const Settings = () => {
  const globalStore = useContext(GlobalStore);

  const [confirmedClearing, setConfirmedClearing] = useState(false);
  const [databaseCleared, setDatabaseCleared] = useState(false);

  const dismissToast = () => setDatabaseCleared(false);

  const clearLocalData = async () => {
    globalStore.results.setList([]);
    const resultDb = getDb(EDbStores.MAIN_STORE_NAME);
    await resultDb.clear();

    setDatabaseCleared(true);
    setConfirmedClearing(false);
    setTimeout(() => setDatabaseCleared(false), 3000);
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

  useInterval(() => {
    calculateStoredDataSize();
  }, 3000);

  useMount(() => {
    calculateStoredDataSize();
  });

  return (
    <div className="flex flex-col gap-12 p-6 h-full">
      <FormControl
        component="fieldset"
        variant="standard"
        className="flex flex-col gap-2"
      >
        <Typography variant="overline" className={'opacity-50'}>
          Appearance settings
        </Typography>

        <ThemeToggle />
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
                  disabled={databaseCleared}
                >
                  Cancel
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
            <span className="font-semibold">About {storedDataSize.value}</span>{' '}
            used
          </Typography>
        ) : (
          <></>
        )}
      </FormControl>

      <Typography
        variant="caption"
        className={'opacity-50 flex-shrink-0 py-2 !mt-auto'}
      >
        Clobbr version {version}
      </Typography>

      <Snackbar
        open={databaseCleared}
        autoHideDuration={6000}
        onClose={dismissToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
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
          <p className="flex h-full items-center">Local result data cleared</p>
        </Alert>
      </Snackbar>
    </div>
  );
};
