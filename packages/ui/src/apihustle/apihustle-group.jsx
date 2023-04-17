import clsx from 'clsx';
import ApiHustle from './apihustle-logo';
import { ClobbrAppLogo } from './clobbr-app-logo';
import { CrontapAppLogo } from './crontap-app-logo';
import { CronToolAppLogo } from './crontool-app-logo';

export const ApiHustleGroup = ({
  className,
  headline,
  layout,
  hideVisitButton,
  useOverlayFullLink,
  otherChildren
}) => {
  return (
    <div className={clsx('flex flex-col gap-2 w-full max-w-md', className)}>
      <a
        href="https://apihustle.com"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-90 hover:opacity-100 transition-opacity duration-200"
      >
        <ApiHustle className={'h-6'} />
      </a>

      {headline ? (
        <p className="text-xs lg:text-sm opacity-40">{headline}</p>
      ) : (
        <></>
      )}

      <ul
        className={clsx(
          'flex gap-6',
          layout === 'horizontal' ? 'flex-row mt-4' : 'flex-col mt-12'
        )}
      >
        <li
          className={clsx(
            'flex gap-3 items-center relative',
            layout === 'horizontal' ? 'flex-col text-xs' : ''
          )}
        >
          <ClobbrAppLogo className={'w-14'} />

          <div>
            <h3>Clobbr</h3>
            {layout === 'horizontal' ? null : (
              <p className="text-xs opacity-70">
                The app & CLI tool to test API endpoint speed.
              </p>
            )}
          </div>

          {hideVisitButton ? (
            ''
          ) : (
            <a
              href="https://clobbr.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
            >
              Visit
            </a>
          )}

          {useOverlayFullLink ? (
            <a
              href="https://clobbr.app"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 hover:backdrop-grayscale transition-all"
            >
              <span className="opacity-0">Visit Clobbr</span>
            </a>
          ) : null}
        </li>

        <li
          className={clsx(
            'flex gap-3 items-center relative',
            layout === 'horizontal' ? 'flex-col text-xs' : ''
          )}
        >
          <CrontapAppLogo className={'w-14'} />

          <div>
            <h3>Crontap</h3>
            {layout === 'horizontal' ? null : (
              <p className="text-xs opacity-70">
                Schedule recurring API calls using cron syntax.
              </p>
            )}
          </div>

          {hideVisitButton ? (
            ''
          ) : (
            <a
              href="https://crontap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
            >
              Visit
            </a>
          )}

          {useOverlayFullLink ? (
            <a
              href="https://crontap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 hover:backdrop-grayscale transition-all"
            >
              <span className="opacity-0">Visit Crontap</span>
            </a>
          ) : null}
        </li>

        <li
          className={clsx(
            'flex gap-3 items-center relative',
            layout === 'horizontal' ? 'flex-col text-xs' : ''
          )}
        >
          <CronToolAppLogo className={'w-14'} />

          <div>
            <h3>CronTool</h3>
            {layout === 'horizontal' ? null : (
              <p className="text-xs opacity-70">
                Debug multiple cron expressions on a calendar.
              </p>
            )}
          </div>

          {hideVisitButton ? (
            ''
          ) : (
            <a
              href="https://tool.crontap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
            >
              Visit
            </a>
          )}

          {useOverlayFullLink ? (
            <a
              href="https://tool.crontap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 hover:backdrop-grayscale transition-all"
            >
              <span className="opacity-0">Visit CronTool</span>
            </a>
          ) : null}
        </li>

        {otherChildren}
      </ul>
    </div>
  );
};
