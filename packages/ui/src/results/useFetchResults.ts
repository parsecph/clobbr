import { ClobbrUIListItem } from 'models/ClobbrUIListItem';

export const useFetchResults = ({
  onDone,
  onList
}: {
  onDone?: () => void;
  onList: (list: ClobbrUIListItem[]) => void;
}) => {
  const fetchResults = async () => {
    try {
      const results = await (window as any).electronAPI.getResults();

      if (results) {
        onList(results);
      }

      onDone?.();
    } catch (error) {
      console.error(error);
    }
  };

  return { fetchResults };
};
