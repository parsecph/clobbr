import Typography from '@mui/material/Typography';

export function GenericFooter() {
  return (
    <footer className="flex gap-1 w-full p-6 fixed bottom-0 justify-center bg-white dark:bg-black">
      <Typography variant="caption" className="flex gap-1">
        <span className="opacity-50">See more on</span>
        <a href="https://clobbr.app" target="_blank" rel="noopener noreferrer">
          clobbr.app
        </a>
      </Typography>
    </footer>
  );
}
