import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import {
  isResultInProgress,
  isResultPartiallyComplete
} from 'results/Result/useResultProperties';
import { UI_RESULT_STATES } from 'models/ClobbrUIResult';

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

      console.log({ results });

      if (results) {
        onList(
          results.map((item: ClobbrUIListItem) => {
            const isPartiallyComplete = isResultPartiallyComplete({
              resultState: item.state
            });

            const isInProgress = isResultInProgress({
              logs: item.logs,
              iterations: item.iterations,
              isPartiallyComplete
            });

            if (isInProgress) {
              item.state = UI_RESULT_STATES.PARTIALLY_COMPLETED;
            }

            return item;
          })
        );
      }

      onDone?.();
    } catch (error) {
      console.error(error);
    }
  };

  return { fetchResults };
};
