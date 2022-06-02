import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { ClobbrUIResult } from 'models/ClobbrUIResult';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { Everbs } from 'shared/enums/http';

export const useResultState = ({ initialState }: { [key: string]: any }) => {
  const [list, setList] = useState<Array<ClobbrUIResultListItem>>(
    initialState.results.list
  );

  const [expandedResults, setExpandedResults] = useState<Array<string>>(
    initialState.results.expandedResults
  );

  const updateExpandedResults = (expandedResults: Array<string>) => {
    setExpandedResults(expandedResults);
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
    averageDuration,
    parallel,
    iterations,
    verb,
    ssl
  }: {
    url: string;
    resultDurations: Array<number>;
    logs: Array<ClobbrLogItem>;
    averageDuration: number;
    parallel: boolean;
    iterations: number;
    verb: Everbs;
    ssl: boolean;
  }) => {
    const runId = uuidv4();

    const result: ClobbrUIResult = {
      id: runId,
      startDate: formatISO(new Date()),
      endDate: undefined,
      resultDurations,
      logs,
      averageDuration
    };

    const existingListItem = list.find((i) => i.url === url && i.verb === verb);

    if (existingListItem) {
      const index = list.findIndex((i) => i.url === url && i.verb === verb);

      const nextItem = {
        ...existingListItem,
        parallel,
        iterations,
        verb,
        latestResult: result,
        historicalResults: [...existingListItem.historicalResults, result]
      };

      setList([...list.slice(0, index), nextItem, ...list.slice(index + 1)]);

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
        latestResult: result,
        historicalResults: []
      };

      setList([...list, listItem]);

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
    const existingListItem = list.find((i) => i.id === itemId);
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

    const averageDuration = resultDurations?.length
      ? Math.round(
          resultDurations.reduce((acc: number, cur: number) => acc + cur, 0) /
            resultDurations.length
        )
      : 0;

    const nextResult: ClobbrUIResult = {
      ...existingListItem.latestResult,
      endDate,
      logs,
      resultDurations,
      averageDuration
    };

    const nextItem = {
      ...existingListItem,
      latestResult: nextResult
    };

    const index = list.findIndex((i) => i.id === itemId);

    setList([...list.slice(0, index), nextItem, ...list.slice(index + 1)]);
  };

  const resultState = {
    list,
    setList,

    addItem,
    updateLatestResult,

    expandedResults,
    updateExpandedResults
  };

  return {
    resultState
  };
};
