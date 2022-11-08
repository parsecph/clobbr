import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState, forwardRef } from 'react';

import { GlobalStore } from 'app/globalContext';
import Logo from 'shared/brand/logo-primary.svg';
import LogoSecondary from 'shared/brand/logo-secondary.svg';

import { ButtonBase, Typography } from '@mui/material';

import { Settings as SettingsIcon } from '@mui/icons-material';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { VersionNumber } from 'shared/components/VersionNumber/VersionNumber';
import { Settings } from 'Settings/Settings';

const Topbar = forwardRef((_props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <GlobalStore.Consumer>
      {({ themeMode, appSettings }) => (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{
            y: 0,
            transition: {
              delay: 0.5,
              duration: 0.2,
              ease: [0.36, 0.66, 0.04, 1]
            }
          }}
          className={clsx(
            'bg-gray-100/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all',
            appSettings.stickySearch ? 'sm:sticky top-0 z-100 py-3' : ''
          )}
          ref={ref}
        >
          <header className="flex justify-between items-center w-full px-4 py-3 ">
            <img
              src={themeMode === 'dark' ? Logo : LogoSecondary}
              alt="Clobbr Logo Symbol (the letter C on a grid)"
              className="h-9 w-auto"
            />

            <ButtonBase
              disableRipple
              className="flex flex-col gap-1 opacity-70 hover:opacity-100 transition-all"
              onClick={() => setSettingsModalOpen(true)}
            >
              <SettingsIcon className="w-5 h-5" aria-label="General Settings" />

              <Typography variant="caption" className="opacity-50">
                Options
              </Typography>
            </ButtonBase>
          </header>

          <Modal
            onClose={() => setSettingsModalOpen(false)}
            open={settingsModalOpen}
            footerComponent={<VersionNumber />}
          >
            <Settings />
          </Modal>
        </motion.div>
      )}
    </GlobalStore.Consumer>
  );
});

export default Topbar;
