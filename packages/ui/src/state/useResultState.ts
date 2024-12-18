import { uniq } from 'lodash-es';
import { useState } from 'react';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import useStateRef from 'react-usestateref';
import { useThrottle } from 'react-use';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

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

  const updateResultLog = (cacheId: string, log: ClobbrLogItem) => {
    const currentList = listRef.current;

    // Find the item by cached id and push a log to logs
    const updatedList = currentList.map((item) => {
      if (item.cacheId === cacheId) {
        item.logs = [...item.logs, log];
      }

      return item;
    });

    setList(updatedList);
  };

  const updateResultLogs = (
    logs: { cacheId: string; log: ClobbrLogItem }[]
  ) => {
    const currentList = listRef.current;

    const updatedList = currentList.map((item) => {
      const itemLogs = logs.filter((log) => log.cacheId === item.cacheId);
      if (itemLogs.length > 0) {
        item.logs = [...item.logs, ...itemLogs.map((log) => log.log)];
      }
      return item;
    });

    setList(updatedList);
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const throttledList = useThrottle(list, 500);

  const resultState = {
    editing,
    toggleEdit,

    list: throttledList,
    listRef,
    setList,

    expandedResults,
    updateExpandedResults,

    expandedResultGroups,
    updateExpandedResultGroups,

    updateResultLog,
    updateResultLogs
  };

  return {
    resultState
  };
};
