import { Alert } from '@mui/material';

import { AnimatePresence } from 'framer-motion';

import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { ReactComponent as AllFailed } from 'shared/images/search/AllFailed.svg';
import { ReactComponent as Timeout } from 'shared/images/search/Timeout.svg';

import { ResultChart } from 'results/ResultChart/ResultChart';
import { ResultStats } from 'results/ResultStats/ResultStats';
import { ReRunResultButton } from 'results/ReRunResultButton/ReRunResultButton';
import { ResultHistoryToggle } from 'results/ResultHistory/ResultHistoryToggle';
import { UpdateSettingsButton } from 'results/UpdateSettingsButton/UpdateSettingsButton';
import { CommonlyFailedItem } from 'results/CommonlyFailedItem/CommonlyFailedItem';
import ActivityIndicator from 'ActivityIndicator/ActivityIndicator';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { useResultProperties } from 'results/Result/useResultProperties';

import { useCommonlyFailedMessage } from 'results/CommonlyFailedItem/useCommonlyFailedMessage';

const ResultContent = ({
  item,
  expanded
}: {
  item: ClobbrUIResultListItem;
  expanded: boolean;
}) => {
  const {
    allFailed,

    timedOut,
    isInProgress,
    failedItems,
    successfulItems
  } = useResultProperties({ item });

  const { message } = useCommonlyFailedMessage({
    logs: item.latestResult.logs
  });

  const shouldShowChart =
    !allFailed &&
    !timedOut &&
    expanded &&
    item.iterations > 1 &&
    successfulItems.length > 1;

  return (
    <AnimatePresence>
      {expanded && allFailed ? (
        <div className="flex flex-col gap-2 pb-12 items-center">
          <AllFailed className="w-full max-w-xs py-6 pt-6" />
          <Typography variant="body1">
            <strong className="font-semibold">
              All requests failed. Some common issues could be:
            </strong>
          </Typography>
          <hr />
          <ul className="list-disc pl-6">
            {item.properties?.gql?.isGql ? (
              <li>
                <Typography variant="body2">
                  GQL is valid & the server does not respond with errors
                </Typography>
              </li>
            ) : (
              ''
            )}
            <li>
              <Typography variant="body2">
                Incorrect method (e.g. should use POST instead of GET)
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                CORS issues; some custom headers might be needed
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Authorization failed; also might need custom headers
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Used http instead of https to make the request
              </Typography>
            </li>
          </ul>

          <div className="px-4 py-2 mt-6 mb-2">
            <CommonlyFailedItem item={item} />
          </div>

          <ResultHistoryToggle item={item} />

          <div className="flex gap-2 mt-4">
            <ReRunResultButton item={item} />
            <UpdateSettingsButton item={item} />
          </div>
        </div>
      ) : (
        ''
      )}

      {expanded && timedOut ? (
        <div className="flex flex-col gap-4 pb-12 items-center">
          <Timeout className="w-full max-w-xs p-6" />
          <Typography variant="body1">
            <strong className="font-semibold">Requests timed out</strong>
          </Typography>

          <Typography variant="body2" className="opacity-50">
            Try reducing the number of iterations and run again? <br />
          </Typography>

          <ResultHistoryToggle item={item} className="-mt-10" />

          <div className="flex gap-2 mt-4">
            <ReRunResultButton item={item} />
            <UpdateSettingsButton item={item} />
          </div>
        </div>
      ) : (
        ''
      )}

      {expanded &&
      !isInProgress &&
      !shouldShowChart &&
      !timedOut &&
      !allFailed ? (
        <>
          <Typography variant="body2" className="opacity-50 text-center">
            Increase the number of itetations to see more stats.
          </Typography>

          <ResultHistoryToggle item={item} />

          <div className="mt-4">
            <ResultStats result={item.latestResult} />
          </div>

          <div className="flex justify-center gap-2 px-2 py-6 mt-8">
            <ReRunResultButton item={item} />
            <UpdateSettingsButton item={item} />
          </div>
        </>
      ) : (
        ''
      )}

      {shouldShowChart ? (
        <div className="relative w-full">
          {isInProgress ? (
            <div className="h-72 flex flex-col items-center justify-center gap-8">
              <ActivityIndicator
                animationIterations="infinite"
                startDelay={0}
              />
              <Typography variant="caption">
                {item.latestResult.resultDurations.length < item.iterations / 2
                  ? 'Getting results'
                  : 'Almost there'}
              </Typography>
            </div>
          ) : (
            <>
              <ResultHistoryToggle item={item} className="-mt-10" />
              <ResultChart item={item} className="mt-4" />
              <ResultStats result={item.latestResult} />

              <footer className="flex flex-col items-center justify-center gap-2 pb-4">
                {failedItems.length ? (
                  <Tooltip title={message || ''}>
                    <div className="flex flex-col items-center">
                      <Alert severity="error">
                        {failedItems.length} failed. Showing results only for
                        successful requests.
                      </Alert>
                    </div>
                  </Tooltip>
                ) : (
                  ''
                )}

                <div className="flex gap-2 mt-4">
                  <ReRunResultButton item={item} />
                  <UpdateSettingsButton item={item} />
                </div>
              </footer>
            </>
          )}
        </div>
      ) : (
        ''
      )}
    </AnimatePresence>
  );
};

export default ResultContent;
