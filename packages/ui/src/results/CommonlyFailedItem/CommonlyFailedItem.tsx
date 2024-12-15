import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { useCommonlyFailedMessage } from 'results/CommonlyFailedItem/useCommonlyFailedMessage';

export const CommonlyFailedItem = ({ item }: { item: ClobbrUIListItem }) => {
  const logs = item.logs;
  const { message } = useCommonlyFailedMessage({ logs });

  return message ? (
    <pre className="whitespace-pre-line text-sm">{message}</pre>
  ) : (
    <></>
  );
};
