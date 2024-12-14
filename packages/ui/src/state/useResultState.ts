import { isPlainObject, uniq } from 'lodash-es';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import useStateRef from 'react-usestateref';
import { ClobbrUIProperties } from 'models/ClobbrUIProperties';
import { useThrottle } from 'react-use';
import { AxiosError } from 'axios';

const unbloatLogs = (log: ClobbrLogItem) => {
  if (log.failed && log.error && isPlainObject(log.error)) {
    try {
      const error = log.error as AxiosError;
      if (error.config) {
        error.config = {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data
        };
      }
    } catch (error) {
      console.error('Failed to prune error object', error);
    }
  }

  delete log.metas.data;
  return log;
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
          .filter(({ listItemId }) => nextExpandedResults.includes(listItemId))
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
  }): {
    listItemId: string;
    cacheId: string;
  } => {
    const cacheId = uuidv4();
    const currentList = listRef.current;

    const logsWithoutBloat = logs.map(unbloatLogs);

    const result: ClobbrUIResult = {
      cacheId,
      startDate: formatISO(new Date()),
      startTimestamp: new Date().valueOf(),
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

      const nextItem: ClobbrUIListItem = {
        ...existingListItem,
        cacheId,
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

      return { listItemId: existingListItem.listItemId, cacheId };
    } else {
      const listItemId = uuidv4();

      const listItem: ClobbrUIListItem = {
        listItemId,
        cacheId,
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

      return { listItemId, cacheId };
    }
  };

  /**
   * Updates the latest result.
   * The result will be looked up by cacheId.
   */
  const updateLatestResult = ({
    cacheId,
    logs
  }: {
    cacheId: string;
    logs: Array<ClobbrLogItem>;
  }) => {
    const currentList = listRef.current;

    const existingListItem = currentList.find((i) => i.cacheId === cacheId);
    const isComplete = existingListItem?.iterations === logs.length;
    const endDate = isComplete ? formatISO(new Date()) : undefined;
    const endTimestamp = isComplete ? new Date().valueOf() : undefined;

    if (!existingListItem) {
      console.warn(`Could not find result item with id ${cacheId}`);
      return false;
    }

    const logsWithoutBloat = logs.map(unbloatLogs);
    const resultDurations = logsWithoutBloat
      .filter((l) => typeof l.metas.duration === 'number')
      .map((l) => {
        return l.metas.duration as number;
      });

    const nextResult: ClobbrUIResult = {
      ...existingListItem.latestResult,
      endDate,
      endTimestamp,
      logs: logsWithoutBloat,
      resultDurations
    };

    const nextItem = {
      ...existingListItem,
      latestResult: nextResult
    };

    const index = currentList.findIndex((i) => i.cacheId === cacheId);

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
