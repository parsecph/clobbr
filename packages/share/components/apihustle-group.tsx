import clsx from "clsx";
import { ApiHustleLogo } from "@/components/apihustle-logo";
import { ClobbrAppLogo } from "@/components/clobbr-app-logo";
import { CrontapAppLogo } from "@/components/crontap-app-logo";
import { CronToolAppLogo } from "./crontool-app-logo";

export const ApiHustleGroup = ({
  className,
  headline,
}: {
  className?: string,
  headline?: string,
}) => {
  return (
    <div className={clsx("flex flex-col gap-2 w-full max-w-md", className)}>
      <a
        href="https://apihustle.com"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-90 hover:opacity-100 transition-opacity duration-200"
      >
        <ApiHustleLogo className={"h-6"} />
      </a>

      {headline ? (
        <p className="text-xs lg:text-sm opacity-40">{headline}</p>
      ) : (
        <></>
      )}

      <ul className="flex flex-col gap-6 mt-12">
        <li className="flex gap-3 items-center">
          <ClobbrAppLogo className={"w-14"} />

          <div>
            <h3>Clobbr</h3>
            <p className="text-xs opacity-70">
              The app & CLI tool to test API endpoint speed.
            </p>
          </div>

          <a
            href="https://clobbr.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
          >
            Visit
          </a>
        </li>

        <li className="flex gap-3 items-center">
          <CrontapAppLogo className={"w-14"} />

          <div>
            <h3>Crontap</h3>
            <p className="text-xs opacity-70">
              Schedule recurring API calls using cron syntax.
            </p>
          </div>

          <a
            href="https://crontap.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
          >
            Visit
          </a>
        </li>

        <li className="flex gap-3 items-center">
          <CronToolAppLogo className={"w-14"} />

          <div>
            <h3>CronTool</h3>
            <p className="text-xs opacity-70">
              Debug multiple cron expressions on a calendar.
            </p>
          </div>

          <a
            href="https://tool.crontap.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex-shrink-0 px-4 py-2 rounded-md text-xs border border-solid border-gray-500/50 hover:border-gray-500 transition-colors"
          >
            Visit
          </a>
        </li>
      </ul>
    </div>
  );
};
