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
  const [showBarCharts, setShowBarCharts] = useState(
    initialState.appSettings.showBarCharts
  );
  const [chartDownSampleThreshold, setChartDownSampleThreshold] = useState(
    initialState.appSettings.chartDownSampleThreshold
  );
  const [collectResponseData, setCollectResponseData] = useState(
    initialState.appSettings.collectResponseData
  );
  const [collectResponseErrors, setCollectResponseErrors] = useState(
    initialState.appSettings.collectResponseErrors
  );

  const toggleStickySearch = () => {
    setStickySearch(!stickySearch);
  };

  const toggleShowTrendline = () => {
    setShowTrendline(!showTrendline);
  };

  const toggleShowBarCharts = () => {
    setShowBarCharts(!showBarCharts);
  };

  const toggleCollectResponseData = () => {
    setCollectResponseData(!collectResponseData);
  };

  const toggleCollectResponseErrors = () => {
    setCollectResponseErrors(!collectResponseErrors);
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

    showBarCharts,
    setShowBarCharts,
    toggleShowBarCharts,

    chartDownSampleThreshold,
    setChartDownSampleThreshold,

    collectResponseData,
    setCollectResponseData,
    toggleCollectResponseData,

    collectResponseErrors,
    setCollectResponseErrors,
    toggleCollectResponseErrors
  };

  return {
    appSettingsState
  };
};
