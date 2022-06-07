import { useContext, useEffect, useState } from 'react';

import { GlobalStore } from 'App/globalContext';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings';

import { run } from '@clobbr/api';

const DEFAULTS = {
  headers: {},
  data: {}
};

export const useResultRunner = ({
  requestUrl,
  parallel,
  iterations,
  verb,
  ssl,
  dataJson,
  headerItems,
  headerInputMode,
  headerShellCmd,
  timeout
}: {
  requestUrl: string;
  parallel: boolean;
  iterations: number;
  verb: Everbs;
  ssl: boolean;
  dataJson: { [key: string]: any };
  headerItems: Array<ClobbrUIHeaderItem>;
  headerInputMode: string;
  headerShellCmd: string;
  timeout: number;
}) => {
  const globalStore = useContext(GlobalStore);

  const [running, setRunning] = useState(false);
  const [requestsInProgress, setRequestsInProgress] = useState(false);

  const [runingItemId, setRuningItemId] = useState('');
  const [headerError, setHeaderError] = useState(false);

  const startRun = async () => {
    const { id } = globalStore.results.addItem({
      url: requestUrl,
      resultDurations: [],
      logs: [],
      averageDuration: 0,
      parallel,
      iterations,
      verb,
      ssl,
      data: dataJson,
      headers: headerItems,
      headerInputMode,
      headerShellCmd,
      timeout
    });

    setRunning(true);
    setRuningItemId(id);
    globalStore.results.updateExpandedResults([id]);
  };

  /**
   * Run effect.
   */
  useEffect(() => {
    if (requestsInProgress) {
      return;
    }

    if (running) {
      const fireRequests = async () => {
        const configuredOptions = {
          url: requestUrl,
          iterations,
          verb,
          timeout,
          data: dataJson ? dataJson : undefined,
          headers: headerItems.reduce((acc, header) => {
            const { value, key } = header;

            if (!key) {
              return acc;
            }

            acc[key] = value || '';
            return acc;
          }, {} as any)
        };

        const options = { ...DEFAULTS, ...configuredOptions };

        const runEventCallback =
          (itemId: string) =>
          (_event: EEvents, log: ClobbrLogItem, logs: Array<ClobbrLogItem>) => {
            if (!log.metas) {
              console.warn(
                `Skipped log for item [${itemId}] because it has no metas`
              );
            }

            globalStore.results.updateLatestResult({ itemId, logs });
          };

        try {
          const electronAPI = (window as any).electronAPI;

          if (electronAPI) {
            electronAPI.onRunCallback(
              runingItemId,
              (
                _electronEvent: any,
                event: EEvents,
                log: ClobbrLogItem,
                logs: Array<ClobbrLogItem>
              ) => {
                if (logs.length === configuredOptions.iterations) {
                  electronAPI.offRunCallback(runingItemId);
                }

                return runEventCallback(runingItemId)(event, log, logs);
              }
            );

            if (headerInputMode === HEADER_MODES.SHELL && headerShellCmd) {
              const output = await electronAPI.runShellCmd(headerShellCmd);

              if (output) {
                try {
                  const parsedJson = JSON.parse(output);

                  if (parsedJson) {
                    options.headers = parsedJson;
                  }
                } catch (error) {
                  setHeaderError(true);
                }
              }
            }

            await electronAPI.run(
              runingItemId,
              parallel,
              options,
              runEventCallback(runingItemId)
            );
          } else {
            await run(parallel, options, runEventCallback(runingItemId));
          }
        } catch (error) {
          // TODO dan: toast
          console.error(error);
        }

        setRequestsInProgress(false);
        globalStore.results.updateExpandedResults([runingItemId]);
      };

      setRequestsInProgress(true);
      fireRequests();

      setRunning(false);
    }
  }, [
    globalStore.results,
    requestUrl,
    iterations,
    parallel,
    verb,
    timeout,
    headerItems,
    dataJson,
    headerInputMode,
    headerShellCmd,
    running,
    runingItemId,
    requestsInProgress
  ]);

  return {
    startRun,

    running,
    requestsInProgress,
    runingItemId,

    headerError,
    setHeaderError
  };
};
