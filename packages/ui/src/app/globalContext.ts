import { VERBS, Everbs } from 'shared/enums/http';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import React from 'react';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { HEADER_MODES } from 'search/SearchSettings/HeaderSettings/HeaderSettings';

// const TEST_URL = 'https://60698fbde1c2a10017544a73.mockapi.io/test';

export const DEFAULT_GLOBAL_STORE = {
  search: {
    iterations: 10,
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
    payloadItems: [],
    ssl: true,
    parallel: true,
    timeout: 10000,
    url: {
      displayText: '',
      requestUrl: ''
    },
    isUrlValid: false,

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
    setSettings(item: ClobbrUIResultListItem) {},
    resetSettingsToDefault() {}
  },

  results: {
    expandedResults: [] as Array<string>,
    expandedResultGroups: [] as Array<string>, // NB: ID'ed by url
    list: [],
    setList: (list: Array<ClobbrUIResultListItem>) => {},

    updateExpandedResults(expandedResults: Array<string>) {},
    updateExpandedResultGroups(expandedResultGroups: Array<string>) {},

    addItem(result: {
      url: string;
      resultDurations: Array<number>;
      logs: Array<ClobbrLogItem>;
      averageDuration: number;
      parallel: boolean;
      iterations: number;
      verb: Everbs;
      ssl: boolean;
      headers: Array<ClobbrUIHeaderItem>;
      headerInputMode: string;
      headerShellCmd: string;
      headerNodeScriptData: {
        text?: string;
        valid: boolean;
      };
      data: { [key: string]: any };
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
    setMaxIterations(maxIterations?: number | '') {}
  }
};

export const GlobalStore = React.createContext(DEFAULT_GLOBAL_STORE);
