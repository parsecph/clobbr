import { ButtonBase, Typography } from '@mui/material';
import { Settings } from '@mui/icons-material';

const SearchSettings = () => {
  return (
    <>
      <ButtonBase
        disableRipple
        className="opacity-50 hover:opacity-100 transition-all flex gap-1"
      >
        <Typography variant="body1">
          Headers and other advanced settings
        </Typography>

        <Settings />
      </ButtonBase>
    </>
  );
};

export default SearchSettings;
