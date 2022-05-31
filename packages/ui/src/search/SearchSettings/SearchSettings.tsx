import { ButtonBase, Typography } from '@mui/material';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';

const SearchSettings = () => {
  return (
    <>
      <ButtonBase
        disableRipple
        className="opacity-50 hover:opacity-100 transition-all flex gap-1"
      >
        <BuildCircleRoundedIcon />
        <Typography variant="body2">Configure</Typography>
      </ButtonBase>
    </>
  );
};

export default SearchSettings;
