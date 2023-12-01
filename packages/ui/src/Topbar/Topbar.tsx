import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState, forwardRef } from 'react';

import { GlobalStore } from 'app/globalContext';

import { ButtonBase, Typography } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

import { Modal } from 'shared/components/AppleModal/AppleModal';
import { VersionNumber } from 'shared/components/VersionNumber/VersionNumber';
import { ClobbrAppLogo } from 'shared/brand/clobbr-app-logo';
import { Settings } from 'Settings/Settings';
import { ApiHustleGroup } from 'apihustle/apihustle-group';

const Topbar = forwardRef((_props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const showAds = process.env.REACT_APP_NO_ADS !== 'true';

  const openNpm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    window.open('https://www.npmjs.com/package/@clobbr/cli', '_blank');
  };

  const openApiHustle = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    window.open('https://apihustle.com', '_blank');
  };

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
            appSettings.stickySearch ? 'sm:sticky top-0 z-100 py-2' : ''
          )}
          ref={ref}
        >
          <header className="flex justify-between items-center w-full px-4 py-2">
            <ClobbrAppLogo width={52} height={52} color={null} className="" />

            <ButtonBase
              disableRipple
              className="h-full flex flex-col gap-2 opacity-70 hover:opacity-100 transition-all"
              onClick={() => setSettingsModalOpen(true)}
            >
              <SettingsIcon className="w-5 h-5" aria-label="General Settings" />

              <Typography
                variant="caption"
                className="opacity-50 !leading-none"
              >
                Options
              </Typography>
            </ButtonBase>
          </header>

          <Modal
            onClose={() => setSettingsModalOpen(false)}
            open={settingsModalOpen}
            footerComponent={
              <div className="flex flex-col gap-6">
                {showAds ? (
                  <ApiHustleGroup
                    otherChildren={
                      <li className="flex gap-3 items-center justify-between relative text-xs">
                        <a
                          href="/"
                          onClick={openNpm}
                          className="flex flex-col items-center gap-3 hover:grayscale transition-all"
                        >
                          <div className="w-14 h-[54px] bg-rose-700 text-white flex items-center justify-center rounded-lg">
                            <span className="font-bold text-base">npm</span>
                          </div>
                          <h3>Clobbr CLI</h3>
                        </a>
                      </li>
                    }
                    hideVisitButton={true}
                    useOverlayFullLink={true}
                    className="pt-12 px-6 mt-auto w-full"
                    layout="horizontal"
                    headline="This tool is part of the Apihustle suite - a collection of tools to test, improve and get to know your API inside and out."
                  />
                ) : (
                  ''
                )}

                <span className="flex gap-1 justify-center items-center">
                  <VersionNumber />
                  {!showAds ? (
                    <>
                      ·
                      <a
                        href="/"
                        onClick={openApiHustle}
                        className="text-xs opacity-50 hover:opacity-100"
                      >
                        apihustle.com
                      </a>
                    </>
                  ) : (
                    ''
                  )}
                </span>
              </div>
            }
          >
            <Settings dismissModal={() => setSettingsModalOpen(false)} />
          </Modal>
        </motion.div>
      )}
    </GlobalStore.Consumer>
  );
});

export default Topbar;
