import { uniq } from 'lodash-es';
import { useState } from 'react';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import useStateRef from 'react-usestateref';
import { useThrottle } from 'react-use';

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
    updateExpandedResultGroups
  };

  return {
    resultState
  };
};
