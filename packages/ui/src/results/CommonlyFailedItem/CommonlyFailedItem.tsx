import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';

export const CommonlyFailedItem = ({
  item
}: {
  item: ClobbrUIResultListItem;
}) => {
  const logs = item.latestResult.logs;
  const mostCommonError = [...logs]
    .sort(
      (a, b) =>
        logs.filter(({ error }) => error?.message === a.error?.message).length -
        logs.filter(({ error }) => error?.message === b.error?.message).length
    )
    .pop();

  return mostCommonError ? (
    <pre className="whitespace-pre-line text-sm">
      {mostCommonError.error?.message}
    </pre>
  ) : (
    <></>
  );
};
