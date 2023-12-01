import { useContext, useState } from 'react';
import { isNumber } from 'lodash-es';

import {
  Typography,
  TextField,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
  FormControl,
  SelectChangeEvent
} from '@mui/material';

import { GlobalStore } from 'app/globalContext';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';
import IterationsInput from 'search/Search/IterationsInput';
import VerbSelect from 'search/Search/VerbSelect';
import { Everbs } from 'shared/enums/http';
import { useToastStore } from 'toasts/state/toastStore';
import clsx from 'clsx';

export const GeneralSettings = () => {
  const globalStore = useContext(GlobalStore);

  const addToast = useToastStore((state) => state.addToast);
  const [urlErrorShown, setUrlErrorShown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [autoFocusUrlInput, setAutoFocusUrlInput] = useState(false);

  const [confirmedSetSettingsToDefault, setConfirmedSetSettingsToDefault] =
    useState(false);

  const setSettingsToDefault = () => {
    globalStore.search.resetSettingsToDefault();
    setConfirmedSetSettingsToDefault(false);

    addToast({
      message: 'Settings reset to default'
    });
  };

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

  const handleVerbChange =
    (updateVerb: (verb: Everbs) => void) =>
    (event: SelectChangeEvent<Everbs>) => {
      updateVerb(event.target.value as Everbs);
    };

  const handleUrlChange =
    (updateUrl: (url: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateUrl(event.target.value.trim());
    };

  const onUrlFieldBlur = () => {
    setInputFocused(false);
    toggleUrlError(false);
  };

  const toggleUrlError = (nextValue: boolean = true) => {
    setUrlErrorShown(nextValue);
    setAutoFocusUrlInput(nextValue);
  };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <>
          <Typography variant="overline" className={'opacity-50'}>
            General settings
          </Typography>

          <TextField
            error={urlErrorShown}
            variant="filled"
            inputRef={(input) =>
              input && autoFocusUrlInput ? input.focus() : null
            }
            onFocus={() => setInputFocused(true)}
            onBlur={onUrlFieldBlur}
            autoFocus={autoFocusUrlInput}
            label="Type an endpoint (URL) to test"
            placeholder="example.com/api/v1"
            id="search"
            value={search.url.displayText}
            onChange={handleUrlChange(search.updateUrl)}
            className={clsx('flex')}
            multiline
            rows={3}
            inputProps={{ style: { resize: 'vertical' } }}
          />

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

            <VerbSelect
              value={search.verb}
              onVerbChange={handleVerbChange(search.updateVerb)}
            />

            {search.properties?.gql?.isGql && search.verb === Everbs.GET ? (
              <Alert severity="warning">
                Graphql request detected. Should this be a POST request?
              </Alert>
            ) : (
              ''
            )}

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
        </>
      )}
    </GlobalStore.Consumer>
  );
};
