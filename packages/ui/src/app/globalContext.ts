import { VERBS, Everbs } from 'shared/enums/http';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import React from 'react';

export const DEFAULT_GLOBAL_STORE = {
  search: {
    iterations: 10,
    verb: VERBS.GET,
    ssl: true,
    parallel: true,
    url: {
      displayText: 'mindrudan.com',
      requestUrl: 'http://mindrudan.com'
    },
    isUrlValid: false,

    updateUrl() {},
    toggleSsl() {},
    toggleParallel() {},
    updateIterations(iterations: number) {},
    updateVerb(verb: Everbs) {}
  },

  results: {
    expandedResults: [] as Array<string>,
    list: [],

    updateExpandedResults(expandedResults: Array<string>) {},

    addItem(result: {
      url: string;
      resultDurations: Array<number>;
      logs: Array<ClobbrLogItem>;
      averageDuration: number;
      parallel: boolean;
      iterations: number;
      verb: Everbs;
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
  setTheme(mode: string) {}
};

export const GlobalStore = React.createContext(DEFAULT_GLOBAL_STORE);
