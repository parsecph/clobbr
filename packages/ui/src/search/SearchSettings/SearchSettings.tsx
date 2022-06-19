import { useState } from 'react';

import { Button, Typography } from '@mui/material';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { a11yProps, TabPanel } from 'shared/components/TabPanel/TabPanel';

import { GeneralSettings } from './GeneralSettings';
import { HeaderSettings } from './HeaderSettings/HeaderSettings';
import { PayloadSettings } from './PayloadSettings';

const SearchSettings = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setActiveTabIndex(newTabIndex);
  };

  return (
    <>
      <Button
        size="small"
        variant="text"
        className="opacity-50 hover:opacity-100 transition-all "
        onClick={() => setSettingsModalOpen(true)}
      >
        <span className="flex gap-1 items-center text-black dark:text-white ">
          <BuildCircleRoundedIcon />
          <Typography variant="body2">Configure</Typography>
        </span>
      </Button>

      <Modal
        onClose={() => setSettingsModalOpen(false)}
        open={settingsModalOpen}
        maxWidth="3xl"
      >
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
      </Modal>
    </>
  );
};

export default SearchSettings;
