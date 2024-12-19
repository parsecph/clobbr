import { VERBS, Everbs } from 'shared/enums/http';
import React from 'react';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrUIProperties } from 'models/ClobbrUIProperties';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';
import {
  ESearchSettingsMode,
  SEARCH_SETTINGS_MODE
} from 'shared/enums/ESearchSettingsMode';

// const TEST_URL = 'https://60698fbde1c2a10017544a73.mockapi.io/test';

export const DEFAULT_GLOBAL_STORE = {
  search: {
    wsReady: false,
    inProgress: false,
    inProgressListItemId: '',
    settingsModalOpen: false,
    settingsMode: SEARCH_SETTINGS_MODE.INPUT as ESearchSettingsMode,

    iterations: 20,
    verb: VERBS.GET as Everbs,
    headerInputMode: HEADER_MODES.INPUT,
    headerShellCmd: '',
    headerItems: [],
    headerNodeScriptData: {
      text: '',
      valid: true
    },
    data: {
      json: {} as { [key: string]: any },
      text: '{}',
      valid: true
    },
    properties: {} as ClobbrUIProperties,
    payloadItems: [],
    ssl: false,
    parallel: true,
    timeout: 10000,
    url: {
      displayText: '',
      requestUrl: ''
    },
    isUrlValid: false,

    setWsReady: (wsReady: boolean) => {},
    setInProgress(inProgress: boolean) {},
    setInProgressListItemId(itemId: string) {},
    showSettingsModal(settingsMode?: ESearchSettingsMode) {},
    hideSettingsModal() {},
    updateUrl(url: string) {},
    updateHeaderInputMode(headerInputMode: string) {},
    updateHeaderShellCmd(headerShellCmd: string) {},
    addHeaderItem(header: ClobbrUIHeaderItem) {},
    updateHeaderItem(header: ClobbrUIHeaderItem) {},
    removeHeaderItem(headerItemId: string) {},
    toggleSsl() {},
    toggleParallel() {},
    updateIterations(iterations: number) {},
    updateVerb(verb: Everbs) {},
    updateTimeout(timeout: number) {},
    updateData(jsonString: string) {},
    updateHeaderNodeScriptData(scriptString: string) {},
    setSettings(item: ClobbrUIListItem) {},
    resetSettingsToDefault() {}
  },

  results: {
    editing: false,

    expandedResults: [] as Array<string>,
    expandedResultGroups: [] as Array<string>, // NB: ID'ed by url
    list: [],
    setList: (list: Array<ClobbrUIListItem>) => {},
    listRef: React.createRef<any>(),

    toggleEdit() {},
    updateExpandedResults(expandedResults: Array<string>) {},
    updateExpandedResultGroups(expandedResultGroups: Array<string>) {},
    updateResultLog(cacheId: string, log: ClobbrLogItem) {},
    updateResultLogs(logs: { cacheId: string; log: ClobbrLogItem }[]) {}
  },

  themeMode: 'dark',
  toggleTheme() {},
  setTheme(mode: string) {},

  appSettings: {
    stickySearch: false,
    setStickySearch: (stickySearch: boolean) => {},
    toggleStickySearch() {},

    maxIterations: 1000,
    setMaxIterations(maxIterations?: number | '') {},

    showTrendline: false,
    setShowTrendline: (showTrendline: boolean) => {},
    toggleShowTrendline() {},

    showBarCharts: false,
    setShowBarCharts: (showBarCharts: boolean) => {},
    toggleShowBarCharts() {},

    chartDownSampleThreshold: 500,
    setChartDownSampleThreshold: (chartDownSampleThreshold: number) => {},

    collectResponseData: false,
    setCollectResponseData: (collectResponseData: boolean) => {},
    toggleCollectResponseData: () => {},

    collectResponseErrors: true,
    setCollectResponseErrors: (collectResponseErrors: boolean) => {},
    toggleCollectResponseErrors: () => {}
  }
};

export const GlobalStore = React.createContext(DEFAULT_GLOBAL_STORE);
