import { isNumber } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { useAsyncFn, useMount, useInterval, useUnmount } from 'react-use';
import byteSize from 'byte-size';

import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { GlobalStore } from 'app/globalContext';
import { SK } from 'storage/storageKeys';
import {
  BUG_REPORT_HREF,
  FEATURE_REQUEST_HREF,
  HELP_HREF,
  MAX_ITERATIONS
} from 'shared/consts/settings';

import {
  Alert,
  FormControl,
  Typography,
  Button,
  TextField
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { a11yProps, TabPanel } from 'shared/components/TabPanel/TabPanel';
import BugReport from '@mui/icons-material/BugReport';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import Help from '@mui/icons-material/Help';
import ThemeToggle from 'Settings/ThemeToggle/ThemeToggle';
import StickySearchToggle from 'Settings/StickySearchToggle/StickySearchToggle';
import TrendlineToggle from 'Settings/TrendlineToggle/TrendlineToggle';
import BarChartToggle from 'Settings/BarChartToggle/BarChartToggle';
import { useToastStore } from 'toasts/state/toastStore';

export const Settings = ({ dismissModal }: { dismissModal: () => void }) => {
  const globalStore = useContext(GlobalStore);

  const addToast = useToastStore((state) => state.addToast);

  const [confirmedClearing, setConfirmedClearing] = useState(false);
  const [databaseCleared, setDatabaseCleared] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setActiveTabIndex(newTabIndex);
  };

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

  const clearLocalData = async () => {
    const resultDb = getDb(EDbStores.RESULT_STORE_NAME);
    await resultDb.clear();

    const resultLogDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);
    await resultLogDb.clear();

    globalStore.results.setList([]);

    setDatabaseCleared(true);
    setConfirmedClearing(false);

    dismissModal();

    addToast({
      message: 'Local data cleared'
    });
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
      {({ appSettings, themeMode }) => (
        <div className="flex flex-col">
          <FormControl
            component="fieldset"
            variant="standard"
            className="flex flex-col gap-2 !p-6"
          >
            <Typography variant="overline" className={'opacity-50'}>
              Support & feature requests
            </Typography>

            <div className="flex gap-2">
              <Button
                className="!px-6 h-11"
                color={themeMode === 'dark' ? 'primary' : 'secondary'}
                variant="outlined"
                startIcon={<BugReport />}
                href={BUG_REPORT_HREF}
              >
                <Typography variant="body2">Bug report</Typography>
              </Button>

              <Button
                className="!px-6 h-11"
                color={themeMode === 'dark' ? 'primary' : 'secondary'}
                variant="outlined"
                startIcon={<AutoFixHigh />}
                href={FEATURE_REQUEST_HREF}
              >
                <Typography variant="body2"> Feature request</Typography>
              </Button>

              <Button
                className="!px-6 h-11"
                color={themeMode === 'dark' ? 'primary' : 'secondary'}
                variant="outlined"
                startIcon={<Help />}
                href={HELP_HREF}
              >
                <Typography variant="body2"> Get help</Typography>
              </Button>
            </div>
          </FormControl>

          <Tabs
            value={activeTabIndex}
            onChange={onTabChange}
            aria-label="Settings tabs"
            indicatorColor="primary"
            className="mt-6"
          >
            <Tab label="User interface" {...a11yProps(1)} />
            <Tab label="Charts" {...a11yProps(0)} />
            <Tab label="Data" {...a11yProps(2)} />
            <Tab label="Advanced" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={activeTabIndex} index={0}>
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
          </TabPanel>

          <TabPanel value={activeTabIndex} index={1}>
            <FormControl
              component="fieldset"
              variant="standard"
              className="flex flex-col gap-2"
            >
              <Typography variant="overline" className={'opacity-50'}>
                Chart visualization settings
              </Typography>

              <TrendlineToggle />
              <BarChartToggle />
            </FormControl>
          </TabPanel>

          <TabPanel value={activeTabIndex} index={2}>
            <FormControl
              component="fieldset"
              variant="standard"
              className="flex flex-col gap-2"
            >
              <Typography variant="overline" className={'opacity-50'}>
                Local data management
              </Typography>

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

              <div>
                {confirmedClearing ? (
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="caption"
                      className="inline-block w-full"
                    >
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
            </FormControl>
          </TabPanel>

          <TabPanel value={activeTabIndex} index={3}>
            <FormControl
              component="fieldset"
              variant="standard"
              className="flex flex-col gap-2"
            >
              <Typography variant="overline" className={'opacity-50'}>
                Other settings
              </Typography>

              <TextField
                variant="outlined"
                label="Maximum allowed iterations"
                placeholder="i.e. 100"
                id="maxIterations"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                value={appSettings.maxIterations}
                helperText={`Defaults to ${MAX_ITERATIONS}`}
                onChange={handleMaxIterationCHange(
                  appSettings.setMaxIterations
                )}
              />
              {appSettings.maxIterations && appSettings.maxIterations > 100 ? (
                <Alert severity="warning">
                  Keep in mind that sending these many requests might increase
                  the costs of your server <br />
                  Generally, around 100 requests should give you a good idea of
                  the performance of an endpoint.
                </Alert>
              ) : (
                <></>
              )}
            </FormControl>
          </TabPanel>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
