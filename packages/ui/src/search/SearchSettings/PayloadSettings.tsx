import { Typography } from '@mui/material';

export const PayloadSettings = () => {
  return (
    <>
      <Typography variant="overline" className={'opacity-50'}>
        {/* Set request payload (data), either static, through faker or a script */}
        Set request payload (data)
      </Typography>

      <div className="flex flex-col gap-6 mt-6"></div>
    </>
  );
};
