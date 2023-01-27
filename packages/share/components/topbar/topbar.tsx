import clsx from 'clsx';
import Image from 'next/image';
import { ClobbrAppLogo } from '../clobbr-app-logo';

export function Topbar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-gray-100/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all',
        className
      )}
    >
      <header className="flex justify-between items-center w-full px-4 py-3">
        <a href="https://clobbr.app" target="_blank" rel="noopener noreferrer">
          <ClobbrAppLogo className={'w-10'} />
        </a>
      </header>
    </div>
  );
}
