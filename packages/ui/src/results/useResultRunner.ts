import { useCallback, useContext } from 'react';
import { isObjectLike } from 'lodash-es';
import { GlobalStore } from 'app/globalContext';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrUIProperties } from 'models/ClobbrUIProperties';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';
import { useToastStore } from 'toasts/state/toastStore';

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
  properties,
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
  properties?: ClobbrUIProperties;
  headerItems: Array<ClobbrUIHeaderItem>;
  headerInputMode?: string;
  headerShellCmd?: string;
  headerNodeScriptData?: { text?: string; valid: boolean };
  timeout: number;
}) => {
  const globalStore = useContext(GlobalStore);

  const addToast = useToastStore((state) => state.addToast);

  const runEventCallback = useCallback(
    (cacheId: string, listItemId: string) => {
      return (
        _event: EEvents,
        log: ClobbrLogItem,
        logs: Array<ClobbrLogItem>
      ) => {
        if (!log.metas) {
          console.warn(
            `Skipped log for item [${cacheId}] because it has no metas`
          );
        }

        globalStore.results.updateLatestResult({ cacheId, logs });

        if (logs.length === globalStore.search.plannedIterations) {
          globalStore.search.setInProgress(false);

          // Update the expanded item yet again to bring the user to the latest results in case there has been navigation in the meantime.
          globalStore.results.updateExpandedResults([listItemId]);
        }
      };
    },
    [globalStore.search, globalStore.results]
  );

  const startRun = useCallback(
    async () => {
      const item = {
        url: requestUrl,
        resultDurations: [],
        logs: [],
        parallel,
        iterations,
        verb,
        ssl,
        data: dataJson,
        properties,
        headers: headerItems,
        headerInputMode,
        headerShellCmd,
        headerNodeScriptData,
        timeout
      };

      const { listItemId, cacheId } = globalStore.results.addItem(item);

      globalStore.results.updateExpandedResults([listItemId]);
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
                addToast({
                  message: 'Header shell script failed. Using default headers.',
                  type: 'error'
                });
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

              if (!isObjectLike(parsedJson)) {
                addToast({
                  message:
                    'Header node.js script did not return a JSON object. Using default headers.',
                  type: 'warning'
                });
              }

              options.headers = parsedJson;
            } catch (error) {
              console.error(error);

              addToast({
                message:
                  'Header node.js script failed to run. Using default headers.',
                type: 'error'
              });
            }
          }

          // NB: results would be received via websocket and not handled in this hook anymore.
          await electronAPI.run(
            cacheId,
            listItemId,
            parallel,
            options,
            item,
            runEventCallback(cacheId, listItemId)
          );
        } else {
          await run(parallel, options, runEventCallback(cacheId, listItemId));
        }
      } catch (error) {
        // Add detailed logging for errors
        console.error('Error during run:', error);
        addToast({
          message:
            'An error occurred during the run. Please change the settings and try again.',
          type: 'error'
        });
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
    startRun
  };
};
