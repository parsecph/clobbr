import { isNumber } from 'lodash-es';
import { useContext } from 'react';

import { Typography, TextField } from '@mui/material';
import { FormControlLabel, FormGroup } from '@mui/material';

import { GlobalStore } from 'App/globalContext';

import AppleSwitch from 'shared/components/AppleSwitch/AppleSwitch';

export const GeneralSettings = () => {
  const handleTimeoutChange =
    (updateTimeout: (iterations: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.target.value, 10);
      if (!event.target.value || isNaN(numericValue) || numericValue < 0) {
        updateTimeout(0);
      } else if (isNumber(numericValue)) {
        updateTimeout(numericValue);
      }
    };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <>
          <div className="flex flex-col gap-6 h-full">
            <Typography variant="overline" className={'opacity-50'}>
              General request settings
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <AppleSwitch
                    onChange={search.toggleSsl}
                    checked={search.ssl}
                  />
                }
                label="Use SSL (https)"
              />
            </FormGroup>

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

            <TextField
              variant="outlined"
              label="Request timeout (ms)"
              placeholder="10000"
              id="timeout"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={search.timeout}
              onChange={handleTimeoutChange(search.updateTimeout)}
            />
          </div>
        </>
      )}
    </GlobalStore.Consumer>
  );
};
