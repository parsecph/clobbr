import clsx from 'clsx';

export const Ping = ({
  size,
  bgColorPingClassName,
  bgColorClassName,
  className
}: {
  size?: number;
  bgColorPingClassName?: string;
  bgColorClassName?: string;
  className?: string;
}) => {
  const computedSize = size || 3;
  const computedBgColorPingClassName = bgColorPingClassName || 'bg-green-500';
  const computedBgColorClassName = bgColorClassName || 'bg-green-400';

  return (
    <span
      className={clsx(
        'flex relative',
        `h-${computedSize}`,
        `w-${computedSize}`,
        className
      )}
    >
      <span
        className={clsx(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          computedBgColorPingClassName
        )}
      ></span>
      <span
        className={clsx(
          'relative inline-flex rounded-full',
          `h-${computedSize}`,
          `w-${computedSize}`,
          computedBgColorClassName
        )}
      ></span>
    </span>
  );
};
