import { useContext } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';

import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

import { GlobalStore } from 'App/globalContext';

export const SetAsSearchButton = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const globalStore = useContext(GlobalStore);

  const setAsSearch = () => {
    globalStore.search.setSettings(item);

    (document.body as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <Button
      onClick={setAsSearch}
      color="primary"
      component="a"
      href="#"
      className="!px-6 h-11"
    >
      <Typography variant="body2">Set as search</Typography>
    </Button>
  );
};
