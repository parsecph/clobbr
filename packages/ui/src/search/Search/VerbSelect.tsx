import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { css } from '@emotion/css';

import { VERBS, Everbs } from 'shared/enums/http';

const selectCssFilled = css`
  .MuiSelect-icon {
    top: auto;
    bottom: 0.5rem;
  }
`;

const selectCssOutlined = css`
  .MuiSelect-icon {
    top: auto;
    bottom: 1rem;
  }
`;

// TODO dan: should allow arbitrary verbs
export const VerbSelect = ({
  customContainerClasses,
  onVerbChange,
  value,
  variant = 'outlined'
}: {
  customContainerClasses?: string;
  onVerbChange: (event: SelectChangeEvent<Everbs>) => void;
  value: Everbs;
  variant?: 'outlined' | 'filled';
}) => {
  return (
    <FormControl className={customContainerClasses}>
      <InputLabel id="search-verb-label">Method</InputLabel>
      <Select
        variant={variant}
        labelId="search-verb-label"
        id="search-verb"
        value={value}
        label="Method"
        onChange={onVerbChange}
        className={variant === 'filled' ? selectCssFilled : selectCssOutlined}
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
