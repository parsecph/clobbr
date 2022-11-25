import Typography from '@mui/material/Typography';

export const ResultListItemSecondaryContent = ({
  formattedDate
}: {
  formattedDate: string;
}) => {
  return (
    <>
      <Typography
        variant="caption"
        className="flex w-full text-left opacity-50"
      >
        {formattedDate ? `${formattedDate} ago` : '...'}
      </Typography>
    </>
  );
};
