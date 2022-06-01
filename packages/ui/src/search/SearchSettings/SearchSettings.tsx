import { useState } from 'react';

import { ButtonBase, Typography } from '@mui/material';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { a11yProps, TabPanel } from 'shared/components/TabPanel/TabPanel';

import { GeneralSettings } from './GeneralSettings';
import { HeaderSettings } from './HeaderSettings';
import { PayloadSettings } from './PayloadSettings';

const SearchSettings = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setActiveTabIndex(newTabIndex);
  };

  return (
    <>
      <ButtonBase
        disableRipple
        className="opacity-50 hover:opacity-100 transition-all flex gap-1"
        onClick={() => setSettingsModalOpen(true)}
      >
        <BuildCircleRoundedIcon />
        <Typography variant="body2">Configure</Typography>
      </ButtonBase>

      <Modal
        onClose={() => setSettingsModalOpen(false)}
        open={settingsModalOpen}
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
