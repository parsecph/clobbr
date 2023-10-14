import { VERBS, Everbs } from 'shared/enums/http';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import React from 'react';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrUIProperties } from 'models/ClobbrUIProperties';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';
import {
  ESearchSettingsMode,
  SEARCH_SETTINGS_MODE
} from 'shared/enums/ESearchSettingsMode';

// const TEST_URL = 'https://60698fbde1c2a10017544a73.mockapi.io/test';

export const DEFAULT_GLOBAL_STORE = {
  search: {
    plannedIterations: 0,
    wsReady: false,
    inProgress: false,
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
    setPlannedIterations: (iterations: number) => {},
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

    addItem(result: {
      url: string;
      resultDurations: Array<number>;
      logs: Array<ClobbrLogItem>;
      parallel: boolean;
      iterations: number;
      verb: Everbs;
      ssl: boolean;
      headers: Array<ClobbrUIHeaderItem>;
      headerInputMode?: string;
      headerShellCmd?: string;
      headerNodeScriptData?: {
        text?: string;
        valid: boolean;
      };
      data: { [key: string]: any };
      properties?: ClobbrUIProperties;
      timeout: number;
    }): { id: string } {
      return { id: '' };
    },

    addLatestResultLog({
      itemId,
      log
    }: {
      itemId: string;
      log: ClobbrLogItem;
    }) {},

    updateLatestResult({
      itemId,
      logs
    }: {
      itemId: string;
      logs: Array<ClobbrLogItem>;
    }) {}
  },

  themeMode: 'dark',
  toggleTheme() {},
  setTheme(mode: string) {},

  appSettings: {
    stickySearch: false,
    setStickySearch: (stickySearch: boolean) => {},
    toggleStickySearch() {},

    maxIterations: 100,
    setMaxIterations(maxIterations?: number | '') {},

    showTrendline: false,
    setShowTrendline: (showTrendline: boolean) => {},
    toggleShowTrendline() {},

    showBarCharts: false,
    setShowBarCharts: (showBarCharts: boolean) => {},
    toggleShowBarCharts() {},

    chartDownSampleThreshold: 500,
    setChartDownSampleThreshold: (chartDownSampleThreshold: number) => {}
  }
};

export const GlobalStore = React.createContext(DEFAULT_GLOBAL_STORE);
