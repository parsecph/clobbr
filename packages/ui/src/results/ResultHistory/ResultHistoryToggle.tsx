import clsx from 'clsx';
import { useState } from 'react';

import {
  ButtonBase,
  Typography,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { Modal } from 'shared/components/AppleModal/AppleModal';

import { GlobalStore } from 'app/globalContext';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { ResultHistory } from './ResultHistory';

import { VERB_COLOR_CLASS_MAP } from 'shared/enums/VerbsToColorMap';
import {
  EResultHistoryMode,
  HISTORY_MODES
} from 'shared/enums/EResultHistoryMode';

export const ResultHistoryToggle = ({
  item,
  className
}: {
  item: ClobbrUIListItem;
  className?: string;
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [historyMode, setHistoryMode] = useState(HISTORY_MODES.CHRONOLOGICAL);

  const updateHistoryMode = (newHistoryMode: EResultHistoryMode) => {
    if (newHistoryMode) {
      setHistoryMode(newHistoryMode);
    }
  };

  const onHistoryViewPressed = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowHistory(true);
  };

  const onHistoryClosePressed = () => {
    setShowHistory(false);
  };

  const toggleButtonStyle = {
    textTransform: 'none',
    padding: '0.25rem 1rem',
    flexShrink: 0
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <div className="contents">
          <div className={clsx(className)}>
            <ButtonBase
              onClick={onHistoryViewPressed}
              color="primary"
              component="a"
              href="#"
              className="!p-2 shrink-0"
            >
              <span className="flex items-center justify-center gap-1 text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors text-sm">
                History & analysis <AssessmentIcon className="!w-5 !h-5" />
              </span>
            </ButtonBase>
          </div>

          <Modal
            onClose={onHistoryClosePressed}
            open={showHistory}
            maxWidth={787}
          >
            <div className="p-4 border-b border-solid border-gray-500 border-opacity-20 flex justify-between items-center flex-wrap gap-4">
              <Typography
                className="flex gap-1 w-full flex-shrink"
                variant="body2"
              >
                <span className="flex shrink-0 items-center gap-1">
                  <AssessmentIcon className="!w-6 !h-6" /> History of
                </span>

                <span className="flex items-center gap-2 truncate font-semibold">
                  <Tooltip title={item.url}>
                    <span className="truncate">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                  </Tooltip>

                  {item.properties?.gql?.isGql ? (
                    <>
                      <small
                        className={clsx(
                          'px-2 py-0.5',
                          'rounded-sm text-black',
                          'bg-fuchsia-300'
                        )}
                      >
                        GQL
                      </small>

                      <small
                        className={clsx(
                          'px-2 py-0.5',
                          'rounded-sm text-black',
                          'bg-gray-300'
                        )}
                      >
                        {item.properties?.gql.gqlName}
                      </small>
                    </>
                  ) : (
                    <small
                      className={clsx(
                        'px-2 py-0.5',
                        'rounded-sm text-black',
                        VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
                      )}
                    >
                      {item.verb.toUpperCase()}
                    </small>
                  )}
                </span>
              </Typography>

              <Typography
                variant="overline"
                className="opacity-50 flex gap-2 justify-between m-0 w-full overflow-hidden"
              >
                <ToggleButtonGroup
                  color={themeMode === 'dark' ? 'primary' : 'secondary'}
                  value={historyMode}
                  exclusive
                  onChange={(
                    _event: React.MouseEvent<HTMLElement>,
                    newMode: EResultHistoryMode
                  ) => updateHistoryMode(newMode)}
                  size="small"
                  className="overflow-x-auto"
                >
                  <ToggleButton
                    value={HISTORY_MODES.CHRONOLOGICAL}
                    sx={toggleButtonStyle}
                  >
                    Chronological
                  </ToggleButton>

                  <ToggleButton
                    value={HISTORY_MODES.SUMMARY}
                    sx={toggleButtonStyle}
                  >
                    Key metrics
                  </ToggleButton>

                  <ToggleButton
                    value={HISTORY_MODES.CHART}
                    sx={toggleButtonStyle}
                  >
                    Charts
                  </ToggleButton>

                  <ToggleButton
                    value={HISTORY_MODES.TABLE}
                    sx={toggleButtonStyle}
                  >
                    Response times
                  </ToggleButton>

                  <ToggleButton
                    value={HISTORY_MODES.RESPONSES}
                    sx={toggleButtonStyle}
                  >
                    Responses
                  </ToggleButton>
                </ToggleButtonGroup>
              </Typography>
            </div>

            <div className="p-4">
              <ResultHistory mode={historyMode} result={item} />
            </div>
          </Modal>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
