import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { css } from '@emotion/css';

import { VERBS, Everbs } from 'shared/enums/http';

const selectCss = css`
  .MuiSelect-icon {
    top: auto;
    bottom: 0.5rem;
  }
`;

// TODO dan: should allow arbitrary verbs
export const VerbSelect = ({
  customContainerClasses,
  onVerbChange,
  value
}: {
  customContainerClasses?: string;
  onVerbChange: (event: SelectChangeEvent<Everbs>) => void;
  value: Everbs;
}) => {
  return (
    <FormControl variant="filled" className={customContainerClasses}>
      <InputLabel id="search-verb-label">Method</InputLabel>
      <Select
        variant="filled"
        labelId="search-verb-label"
        id="search-verb"
        value={value}
        label="Method"
        onChange={onVerbChange}
        className={selectCss}
      >
        {Object.keys(VERBS).map((verb: string) => (
          <MenuItem
            key={verb}
            value={(VERBS as { [key: string]: string })[verb]}
          >
            <span className="capitalize">{verb}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VerbSelect;
