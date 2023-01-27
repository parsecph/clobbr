import Typography from '@mui/material/Typography';
import { ApiHustleGroup } from '../apihustle-group';

export function GenericFooter() {
  return (
    <div className="mt-12 w-ful mt-autol">
      <div className="mt-10 w-full px-4 py-8 md:py-12 fancyGlass">
        <div className="w-full flex justify-center">
          <ApiHustleGroup
            headline={
              'This tool is part of the Apihustle suite - a collection of tools to test, improve and get to know your API inside and out.'
            }
          />
        </div>
      </div>

      <footer className="flex gap-1 w-full p-6 justify-center bg-white dark:bg-black">
        <Typography variant="caption" className="flex gap-1">
          <span className="opacity-50">See more on</span>
          <a
            href="https://clobbr.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            clobbr.app
          </a>
        </Typography>
      </footer>
    </div>
  );
}
