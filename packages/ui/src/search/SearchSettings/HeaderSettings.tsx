import { SyntheticEvent, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  IconButton,
  Typography,
  FormGroup,
  TextField,
  Autocomplete
} from '@mui/material';
import { Clear, Delete } from '@mui/icons-material';

import { KNOWN_HEADERS } from 'enums/EKnownHeaders';

import { GlobalStore } from 'App/globalContext';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';

export const HeaderSettings = () => {
  const globalStore = useContext(GlobalStore);

  const handleHeaderItemKeyChange =
    (header: ClobbrUIHeaderItem) =>
    (_event: SyntheticEvent, newKey: string | null) => {
      globalStore.search.updateHeaderItem({
        ...header,
        key: newKey || ''
      });
    };

  const handleHeaderValueChange =
    (header: ClobbrUIHeaderItem) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      globalStore.search.updateHeaderItem({
        ...header,
        value: event.target.value || ''
      });
    };

  useEffect(() => {
    const allHeadersHaveAKey = globalStore.search.headerItems.every(
      (header: ClobbrUIHeaderItem) => header.key
    );

    if (allHeadersHaveAKey) {
      globalStore.search.addHeaderItem({
        id: uuidv4(),
        key: '',
        value: '',
        enabled: true
      });
    }
  }, [globalStore.search.headerItems, globalStore.search]);

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <>
          <Typography variant="overline" className={'opacity-50'}>
            {/* Set request headers, either static or through a script */}
            Set request headers
          </Typography>

          <div className="flex flex-col gap-3 mt-6">
            {search.headerItems.map((header: ClobbrUIHeaderItem) => (
              <FormGroup key={header.id} className="!grid gap-1 grid-cols-12">
                <Autocomplete
                  freeSolo
                  forcePopupIcon={false}
                  inputValue={header.key}
                  onInputChange={handleHeaderItemKeyChange(header)}
                  id={`${header.id}-header-autocomplete`}
                  options={Object.values(KNOWN_HEADERS)}
                  renderInput={(params) => (
                    <TextField {...params} label="Header Key" />
                  )}
                  className="col-span-5"
                />

                <div className="flex gap-2 col-span-7 items-center">
                  <TextField
                    variant="outlined"
                    label="Value"
                    placeholder=""
                    id={`${header.id}-header-value`}
                    value={header.value}
                    onChange={handleHeaderValueChange(header)}
                    className="w-full"
                    InputProps={{
                      endAdornment: header.value ? (
                        <IconButton
                          size="small"
                          onClick={() => {
                            search.updateHeaderItem({
                              ...header,
                              value: ''
                            });
                          }}
                          className="!p-1 !-mr-2"
                        >
                          <Clear style={{ fontSize: '1.25rem' }} />
                        </IconButton>
                      ) : (
                        ''
                      )
                    }}
                  />

                  <IconButton
                    className="flex-grow-0 flex-shrink-0 !p-1"
                    size="small"
                    onClick={() => {
                      search.removeHeaderItem(header.id);
                    }}
                  >
                    <Delete className="!w-5 !h-5" />
                  </IconButton>
                </div>
              </FormGroup>
            ))}
          </div>
        </>
      )}
    </GlobalStore.Consumer>
  );
};
