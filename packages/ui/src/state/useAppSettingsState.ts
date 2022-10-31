import { useState } from 'react';

export const useAppSettingsState = ({
  initialState
}: {
  [key: string]: any;
}) => {
  const [stickySearch, setStickySearch] = useState(initialState.stickySearch);
  const [maxIterations, setMaxIterations] = useState(
    initialState.appSettings.maxIterations
  );
  const [showTrendline, setShowTrendline] = useState(
    initialState.appSettings.showTrendline
  );
  const [chartDownSampleThreshold, setChartDownSampleThreshold] = useState(
    initialState.appSettings.chartDownSampleThreshold
  );

  const toggleStickySearch = () => {
    setStickySearch(!stickySearch);
  };

  const toggleShowTrendline = () => {
    setShowTrendline(!showTrendline);
  };

  const appSettingsState = {
    stickySearch,
    setStickySearch,
    toggleStickySearch,

    maxIterations,
    setMaxIterations,

    showTrendline,
    setShowTrendline,
    toggleShowTrendline,

    chartDownSampleThreshold,
    setChartDownSampleThreshold
  };

  return {
    appSettingsState
  };
};
