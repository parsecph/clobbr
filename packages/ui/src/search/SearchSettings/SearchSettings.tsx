import clsx from 'clsx';
import { useState, useContext } from 'react';

import { Button, Typography, CircularProgress } from '@mui/material';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { a11yProps, TabPanel } from 'shared/components/TabPanel/TabPanel';
import { GlobalStore } from 'App/globalContext';

import { GeneralSettings } from './GeneralSettings';
import { HeaderSettings } from './HeaderSettings/HeaderSettings';
import { PayloadSettings } from './PayloadSettings';

import { useResultRunner } from 'results/useResultRunner';
import { SEARCH_SETTINGS_MODE } from 'shared/enums/ESearchSettingsMode';

const SearchSettings = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const globalStore = useContext(GlobalStore);

  const { startRun } = useResultRunner({
    requestUrl: globalStore.search.url.requestUrl,
    parallel: globalStore.search.parallel,
    iterations: globalStore.search.iterations,
    verb: globalStore.search.verb,
    ssl: globalStore.search.ssl,
    dataJson: globalStore.search.data.json,
    headerItems: globalStore.search.headerItems,
    headerInputMode: globalStore.search.headerInputMode,
    headerShellCmd: globalStore.search.headerShellCmd,
    headerNodeScriptData: globalStore.search.headerNodeScriptData,
    timeout: globalStore.search.timeout
  });

  const runWithNewSettings = () => {
    startRun();
    globalStore.search.hideSettingsModal();
  };

  const onTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setActiveTabIndex(newTabIndex);
  };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <>
          <Button
            size="small"
            variant="text"
            className="opacity-50 hover:opacity-100 transition-all "
            onClick={() => search.showSettingsModal()}
            disabled={search.inProgress}
          >
            <span className="flex gap-1 items-center text-black dark:text-white ">
              <BuildCircleRoundedIcon />
              <Typography variant="body2">Configure</Typography>
            </span>
          </Button>

          <Modal
            onClose={search.hideSettingsModal}
            open={search.settingsModalOpen}
            maxWidth="3xl"
            closeButtonText={
              search.settingsMode === SEARCH_SETTINGS_MODE.INPUT
                ? 'Save'
                : 'Cancel'
            }
            footerButtons={
              <Button
                variant="contained"
                size="small"
                className={clsx(search.inProgress ? '!bg-gray-600' : '')}
                onClick={runWithNewSettings}
                disabled={
                  !search.isUrlValid || search.inProgress || !search.wsReady
                }
              >
                Run
              </Button>
            }
          >
            {search.inProgress ? (
              <div className="p-6">
                <CircularProgress size={20} />
              </div>
            ) : (
              <>
                <Tabs
                  value={activeTabIndex}
                  onChange={onTabChange}
                  aria-label="basic tabs example"
                  indicatorColor="primary"
                >
                  <Tab label="General" {...a11yProps(0)} />
                  <Tab label="Headers" {...a11yProps(1)} />
                  <Tab label="Payload" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={activeTabIndex} index={0}>
                  <GeneralSettings />
                </TabPanel>
                <TabPanel value={activeTabIndex} index={1}>
                  <HeaderSettings />
                </TabPanel>
                <TabPanel value={activeTabIndex} index={2}>
                  <PayloadSettings />
                </TabPanel>
              </>
            )}
          </Modal>
        </>
      )}
    </GlobalStore.Consumer>
  );
};

export default SearchSettings;
