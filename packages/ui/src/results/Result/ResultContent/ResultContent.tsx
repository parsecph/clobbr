import { useContext } from 'react';

import { AnimatePresence } from 'framer-motion';

import { Alert } from '@mui/material';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { ReactComponent as AllFailed } from 'shared/images/search/AllFailed.svg';

import { ResultChart } from 'results/ResultChart/ResultChart';
import { ResultStats } from 'results/ResultStats/ResultStats';
import { ReRunResultButton } from 'results/ReRunResultButton/ReRunResultButton';
import { ResultHistoryToggle } from 'results/ResultHistory/ResultHistoryToggle';
import { ShareResultToggle } from 'results/ShareResult/ShareResultToggle';
import { UpdateSettingsButton } from 'results/UpdateSettingsButton/UpdateSettingsButton';
import { CommonlyFailedItem } from 'results/CommonlyFailedItem/CommonlyFailedItem';
import ActivityIndicator from 'ActivityIndicator/ActivityIndicator';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { useResultProperties } from 'results/Result/useResultProperties';

import { useCommonlyFailedMessage } from 'results/CommonlyFailedItem/useCommonlyFailedMessage';
import { GlobalStore } from 'app/globalContext';

const ResultContent = ({
  item,
  expanded
}: {
  item: ClobbrUIListItem;
  expanded: boolean;
}) => {
  const globalStore = useContext(GlobalStore);

  const {
    allFailed,
    failedItems,
    successfulItems,
    pctOfSuccess,
    pctOfProgress
  } = useResultProperties({ item });

  const { message } = useCommonlyFailedMessage({
    logs: item.logs
  });

  const showTrendline = globalStore.appSettings.showTrendline;
  const showBarCharts = globalStore.appSettings.showBarCharts;
  const showYAxis = globalStore.appSettings.showYAxis;
  const chartDownSampleThreshold =
    globalStore.appSettings.chartDownSampleThreshold;

  const shouldShowChart =
    !allFailed && expanded && item.iterations > 1 && successfulItems.length > 1;

  const shouldShowLoader =
    globalStore.search.inProgress &&
    item.listItemId === globalStore.search.inProgressListItemId &&
    successfulItems.length < 2;

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
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
                <li>
                  <Typography variant="body2">
                    Increase the timeout setting if the server is slow
                  </Typography>
                </li>
              </ul>

              <div className="px-4 py-2 mt-6 mb-2">
                <CommonlyFailedItem item={item} />
              </div>

              <div className="w-full absolute z-40 flex gap-4 justify-center -mt-2">
                <ResultHistoryToggle item={item} />
              </div>

              <div className="flex gap-2 mt-4">
                <ReRunResultButton item={item} />
                <UpdateSettingsButton item={item} />
              </div>
            </div>
          ) : (
            ''
          )}

          {expanded && !search.inProgress && !shouldShowChart && !allFailed ? (
            <>
              <Typography variant="body2" className="opacity-50 text-center">
                Increase the number of iterations to see more stats.
              </Typography>

              <div className="w-full absolute z-40 flex gap-4 justify-center -mt-2">
                <ResultHistoryToggle item={item} />
              </div>

              <div className="mt-4">
                <ResultStats result={item} />
              </div>

              {failedItems.length ? (
                <Tooltip title={message || ''}>
                  <div className="flex flex-col items-center">
                    <Alert severity="error">
                      {failedItems.length} failed. Showing results only for
                      successful requests ({Math.round(pctOfSuccess)}%
                      succeeded).
                    </Alert>
                  </div>
                </Tooltip>
              ) : (
                ''
              )}

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
              {item.resultDurations?.length < 2 ? (
                <div className="h-72 flex flex-col items-center justify-center gap-8">
                  <ActivityIndicator
                    animationIterations="infinite"
                    startDelay={0}
                  />
                  <Typography variant="caption">
                    {item.resultDurations?.length < item.iterations / 2
                      ? 'Getting results'
                      : 'Almost there'}
                  </Typography>
                </div>
              ) : (
                <>
                  <div className="w-full absolute z-40 flex gap-4 justify-center -mt-10">
                    <ResultHistoryToggle item={item} />
                    <ShareResultToggle
                      item={item}
                      disabled={item.listItemId === search.inProgressListItemId}
                    />
                  </div>

                  <ResultChart
                    key={item.cacheId}
                    item={item}
                    showTrendline={showTrendline}
                    showBarCharts={showBarCharts}
                    showYAxis={showYAxis}
                    chartDownSampleThreshold={chartDownSampleThreshold}
                    className="mt-4"
                  />
                  <ResultStats result={item} />

                  {item.listItemId === search.inProgressListItemId ? (
                    <div className="opacity-50 absolute xl:-mt-2 w-full flex flex-col items-center">
                      <div className="w-full bg-gray-200 h-0.5 dark:bg-gray-700">
                        <div
                          className="bg-black dark:bg-white h-0.5 rounded-tr-full rounded-br-full transition-all duration-500"
                          style={{ width: `${pctOfProgress}%` }}
                        ></div>

                        <div className="absolute bg-primary-500/5 h-0.5 transition-all duration-500 w-full"></div>
                      </div>
                      <Typography
                        variant="body2"
                        className="!text-xs p-2 w-full text-right pointer-events-none"
                      >
                        {pctOfProgress}%
                      </Typography>
                    </div>
                  ) : (
                    ''
                  )}

                  <footer className="flex flex-col items-center justify-center gap-2 pb-4">
                    {failedItems.length ? (
                      <Tooltip title={message || ''}>
                        <div className="flex flex-col items-center">
                          <Alert severity="error">
                            {failedItems.length} failed. Showing results only
                            for successful requests ({Math.round(pctOfSuccess)}%
                            succeeded).
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
          ) : null}

          {shouldShowLoader ? (
            <div className="h-72 flex flex-col items-center justify-center gap-8">
              <ActivityIndicator
                animationIterations="infinite"
                startDelay={0}
              />
              <Typography variant="caption">Getting results</Typography>
            </div>
          ) : null}
        </AnimatePresence>
      )}
    </GlobalStore.Consumer>
  );
};

export default ResultContent;
