import { useCallback, useContext, useState } from 'react';

import { GlobalStore } from 'app/globalContext';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';

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
  headerNodeScriptData,
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
  headerNodeScriptData: { text?: string; valid: boolean };
  timeout: number;
}) => {
  const globalStore = useContext(GlobalStore);

  const [headerError, setHeaderError] = useState<string>('');

  const runEventCallback = useCallback(
    (itemId: string) => {
      return (
        _event: EEvents,
        log: ClobbrLogItem,
        logs: Array<ClobbrLogItem>
      ) => {
        if (!log.metas) {
          console.warn(
            `Skipped log for item [${itemId}] because it has no metas`
          );
        }

        globalStore.results.updateLatestResult({ itemId, logs });

        if (logs.length === globalStore.search.plannedIterations) {
          globalStore.search.setInProgress(false);

          // Update the expanded item yet again to bring the user to the latest results in case there has been navigation in the meantime.
          globalStore.results.updateExpandedResults([itemId]);
        }
      };
    },
    [globalStore.search, globalStore.results]
  );

  const startRun = useCallback(
    async () => {
      const { id: itemId } = globalStore.results.addItem({
        url: requestUrl,
        resultDurations: [],
        logs: [],
        parallel,
        iterations,
        verb,
        ssl,
        data: dataJson,
        headers: headerItems,
        headerInputMode,
        headerShellCmd,
        headerNodeScriptData,
        timeout
      });

      globalStore.results.updateExpandedResults([itemId]);
      globalStore.search.setInProgress(true);
      globalStore.search.setPlannedIterations(iterations);

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

      try {
        const electronAPI = (window as any).electronAPI;

        if (electronAPI) {
          if (headerInputMode === HEADER_MODES.SHELL && headerShellCmd) {
            const output = await electronAPI.runShellCmd(headerShellCmd);

            if (output) {
              try {
                const parsedJson = JSON.parse(output);

                if (parsedJson) {
                  options.headers = parsedJson;
                }
              } catch (error) {
                setHeaderError(
                  'Header shell script failed. Using default headers.'
                );
              }
            }
          }

          if (
            headerInputMode === HEADER_MODES.NODE_JS &&
            headerNodeScriptData?.text
          ) {
            try {
              const { result, isSuccess } = await electronAPI.runNodeCmd(
                headerNodeScriptData?.text
              );

              if (!isSuccess || !result) {
                throw new Error('Node script failed.');
              }

              const parsedJson = JSON.parse(result);
              options.headers = parsedJson;
            } catch (error) {
              console.error(error);
              setHeaderError(
                'Header node.js script failed to run. Using default headers.'
              );
            }
          }

          // NB: results would be recieved via websocket and not handled in this hook anymore.
          await electronAPI.run(
            itemId,
            parallel,
            options,
            runEventCallback(itemId)
          );
        } else {
          await run(parallel, options, runEventCallback(itemId));
        }
      } catch (error) {
        // TODO dan: toast
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      globalStore.results,
      globalStore.results.list,
      requestUrl,
      parallel,
      iterations,
      verb,
      ssl,
      dataJson,
      headerItems,
      headerInputMode,
      headerShellCmd,
      headerNodeScriptData,
      timeout
    ]
  );

  return {
    startRun,

    headerError,
    setHeaderError
  };
};
