import { orderBy } from 'lodash-es';
import List from '@mui/material/List';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import Result from 'results/Result/Result';

const ResultList = ({ list }: { list: Array<ClobbrUIResultListItem> }) => {
  return (
    <List className="w-full">
      {orderBy(list, ['latestResult.startDate'], ['desc']).map((item) => (
        <Result item={item} key={item.id} />
      ))}
    </List>
  );
};

export default ResultList;
