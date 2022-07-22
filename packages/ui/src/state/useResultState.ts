import { uniq } from 'lodash-es';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import useStateRef from 'react-usestateref';

export const useResultState = ({ initialState }: { [key: string]: any }) => {
  const [editing, setEditing] = useState(false);

  const [list, setList, listRef] = useStateRef<Array<ClobbrUIResultListItem>>(
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
    timeout
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
  }) => {
    const runId = uuidv4();
    const currentList = listRef.current;

    const result: ClobbrUIResult = {
      id: runId,
      startDate: formatISO(new Date()),
      endDate: undefined,
      resultDurations,
      logs
    };

    const existingListItem = currentList.find(
      (i) => i.url === url && i.verb === verb
    );

    if (existingListItem) {
      const index = currentList.findIndex(
        (i) => i.url === url && i.verb === verb
      );

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
        timeout,
        latestResult: result,
        historicalResults: [...existingListItem.historicalResults, result]
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
        timeout,
        data,
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

    const resultDurations = logs
      .filter((l) => typeof l.metas.duration === 'number')
      .map((l) => {
        return l.metas.duration as number;
      });

    const nextResult: ClobbrUIResult = {
      ...existingListItem.latestResult,
      endDate,
      logs,
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

  const resultState = {
    editing,
    toggleEdit,

    list,
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
