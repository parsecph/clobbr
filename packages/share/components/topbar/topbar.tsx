import clsx from 'clsx';
import Image from 'next/image';

export function Topbar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-gray-100/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all',
        className
      )}
    >
      <header className="flex justify-between items-center w-full px-4 py-3 ">
        <Image
          alt="Clobbr Logo"
          src="/img/clobbr-logo.svg"
          className="h-9 w-auto"
          width={47}
          height={50}
        />
      </header>
    </div>
  );
}
