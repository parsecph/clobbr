import { useContext } from 'react';
import { Button, Typography } from '@mui/material';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { GlobalStore } from 'App/globalContext';

export const SetAsSearchButton = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const globalStore = useContext(GlobalStore);

  const setAsSearch = () => {
    globalStore.results.updateExpandedResults([]);
    globalStore.results.updateExpandedResultGroups([]);

    globalStore.search.setSettings(item);

    setTimeout(() => {
      document.documentElement.scrollTo(0, 0);
    }, 500);
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <Button
          onClick={setAsSearch}
          color={themeMode === 'dark' ? 'primary' : 'secondary'}
          component="a"
          variant="outlined"
          href="#"
          className="!px-6 h-11"
        >
          <Typography variant="body2">Set as search</Typography>
        </Button>
      )}
    </GlobalStore.Consumer>
  );
};
