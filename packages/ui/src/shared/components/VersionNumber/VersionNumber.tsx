import { Typography } from '@mui/material';

const version = require('../../../../package.json').version;

export const VersionNumber = () => {
  return (
    <Typography
      variant="caption"
      className={'opacity-50 flex-shrink-0 py-2 text-center !mt-auto'}
    >
      Clobbr v{version}
    </Typography>
  );
};
