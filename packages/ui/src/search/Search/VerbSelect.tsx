import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';

import { VERBS, Everbs } from 'shared/enums/http';

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
      <InputLabel id="search-verb-label">Verb</InputLabel>
      <Select
        variant="filled"
        labelId="search-verb-label"
        id="search-verb"
        value={value}
        label="Verb"
        onChange={onVerbChange}
      >
        {Object.keys(VERBS).map((verb: string) => (
          <MenuItem
            key={verb}
            value={(VERBS as { [key: string]: string })[verb]}
          >
            <span className="capitalize">{verb.toLowerCase()}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VerbSelect;
