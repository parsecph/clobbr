import { isPlainObject, uniq } from 'lodash-es';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { Everbs } from 'shared/enums/http';
import { getResultLogsKey } from 'shared/util/getResultLogsKey';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import useStateRef from 'react-usestateref';
import { ClobbrUIProperties } from 'models/ClobbrUIProperties';
import { useThrottle } from 'react-use';
import { AxiosError } from 'axios';
import { IStorage, getDb } from 'storage/storage';
import { SK } from 'storage/storageKeys';
import { EDbStores } from 'storage/EDbStores';

const unbloatLogs = (log: ClobbrLogItem) => {
  if (log.failed && log.error && isPlainObject(log.error)) {
    try {
      const error = log.error as AxiosError;
      error.config = {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        data: error.config.data
      };
    } catch (error) {
      console.error('Failed to prune error object', error);
    }
  }

  delete log.metas.data;
  return log;
};

const writeLogResponsesToStorage = async ({
  resultDb,
  cachedId,
  logs
}: {
  resultDb: IStorage;
  cachedId: string;
  logs: Array<ClobbrLogItem>;
}) => {
  for (const log of logs) {
    const id = getResultLogsKey({
      cachedId,
      index: log.metas.index
    });

    await resultDb.setItem(`${SK.RESULT_RESPONSE.ITEM}-${id}`, {
      index: log.metas.index,
      data: log.metas.data
    });
  }
};

export const useResultState = ({ initialState }: { [key: string]: any }) => {
  const [editing, setEditing] = useState(false);

  const [list, setList, listRef] = useStateRef<Array<ClobbrUIListItem>>(
    initialState.results.list
  );

  const [expandedResults, setExpandedResults] = useState<Array<string>>(
    initialState.results.expandedResults
  );

  const [expandedResultGroups, setExpandedResultGroups] = useState<
    Array<string>
  >(initialState.results.expandedResultGroups);

  const updateExpandedResults = (nextExpandedResults: Array<string>) => {
    const currentList = listRef.current;

    setExpandedResults(nextExpandedResults);

    // Also expand containing groups for added items by default.
    updateExpandedResultGroups(
      uniq([
        ...expandedResultGroups,
        ...currentList
          .filter(({ id }) => nextExpandedResults.includes(id))
          .map(({ url }) => url)
      ])
    );
  };

  const updateExpandedResultGroups = (
    nextExpandedResultGroups: Array<string>
  ) => {
    setExpandedResultGroups(nextExpandedResultGroups);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  /**
   * Adds a new item to the result list.
   * If an item with the same url exists, amends it -
   * - moving latestResult to historicalResults.
   */
  const addItem = ({
    url,
    resultDurations,
    logs,
    parallel,
    iterations,
    verb,
    ssl,
    headers,
    headerInputMode,
    headerShellCmd,
    headerNodeScriptData,
    data,
    timeout,
    properties
  }: {
    url: string;
    resultDurations: Array<number>;
    logs: Array<ClobbrLogItem>;
    parallel: boolean;
    iterations: number;
    verb: Everbs;
    ssl: boolean;
    headers: Array<ClobbrUIHeaderItem>;
    headerInputMode: string;
    headerShellCmd: string;
    headerNodeScriptData: {
      text?: string;
      valid: boolean;
    };
    data: { [key: string]: any };
    timeout: number;
    properties: ClobbrUIProperties;
  }) => {
    const runId = uuidv4();
    const cachedId = uuidv4();
    const currentList = listRef.current;

    const resultDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);
    writeLogResponsesToStorage({
      resultDb,
      cachedId,
      logs: structuredClone(logs)
    });

    const logsWithoutBloat = logs.map(unbloatLogs);

    const result: ClobbrUIResult = {
      id: runId,
      cachedId,
      startDate: formatISO(new Date()),
      endDate: undefined,
      resultDurations,
      logs: logsWithoutBloat,
      parallel,
      iterations,
      headers,
      headerInputMode,
      headerShellCmd,
      headerNodeScriptData,
      data,
      timeout
    };

    const determineExistingItem = (i: ClobbrUIListItem) => {
      if (i.properties?.gql?.isGql) {
        return (
          i.url === url &&
          i.properties?.gql?.gqlName === properties?.gql?.gqlName
        );
      }

      return i.url === url && i.verb === verb;
    };

    const existingListItem = currentList.find(determineExistingItem);

    if (existingListItem) {
      const index = currentList.findIndex(determineExistingItem);

      const nextItem = {
        ...existingListItem,
        parallel,
        iterations,
        verb,
        headers,
        headerInputMode,
        headerShellCmd,
        headerNodeScriptData,
        data,
        properties,
        timeout,
        latestResult: result,
        historicalResults: [
          ...existingListItem.historicalResults,
          existingListItem.latestResult
        ]
      };

      setList([
        ...currentList.slice(0, index),
        nextItem,
        ...currentList.slice(index + 1)
      ]);

      return { id: existingListItem.id };
    } else {
      const id = uuidv4();

      const listItem = {
        id,
        url,
        parallel,
        iterations,
        verb,
        ssl,
        headers,
        headerInputMode,
        headerShellCmd,
        headerNodeScriptData,
        data,
        timeout,
        properties,
        latestResult: result,
        historicalResults: []
      };

      setList([...currentList, listItem]);

      return { id };
    }
  };

  /**
   * Updates the latest result.
   */
  const updateLatestResult = ({
    itemId,
    logs
  }: {
    itemId: string;
    logs: Array<ClobbrLogItem>;
  }) => {
    const currentList = listRef.current;

    const existingListItem = currentList.find((i) => i.id === itemId);
    const isComplete = existingListItem?.iterations === logs.length;
    const endDate = isComplete ? formatISO(new Date()) : undefined;

    if (!existingListItem) {
      console.warn(`Could not find result item with id ${itemId}`);
      return false;
    }

    const resultDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);
    writeLogResponsesToStorage({
      resultDb,
      cachedId: existingListItem.latestResult.cachedId,
      logs: structuredClone(logs)
    });

    const logsWithoutBloat = logs.map(unbloatLogs);
    const resultDurations = logsWithoutBloat
      .filter((l) => typeof l.metas.duration === 'number')
      .map((l) => {
        return l.metas.duration as number;
      });

    const nextResult: ClobbrUIResult = {
      ...existingListItem.latestResult,
      endDate,
      logs: logsWithoutBloat,
      resultDurations
    };

    const nextItem = {
      ...existingListItem,
      latestResult: nextResult
    };

    const index = currentList.findIndex((i) => i.id === itemId);

    setList([
      ...currentList.slice(0, index),
      nextItem,
      ...currentList.slice(index + 1)
    ]);
  };

  const throttledList = useThrottle(list, 500);

  const resultState = {
    editing,
    toggleEdit,

    list: throttledList,
    listRef,
    setList,

    addItem,
    updateLatestResult,

    expandedResults,
    updateExpandedResults,

    expandedResultGroups,
    updateExpandedResultGroups
  };

  return {
    resultState
  };
};
