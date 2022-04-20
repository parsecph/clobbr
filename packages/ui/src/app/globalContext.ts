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
      displayText: '',
      requestUrl: ''
    },
    isUrlValid: false,

    updateUrl() {},
    toggleSsl() {},
    toggleParallel() {},
    updateIterations(iterations: number) {},
    updateVerb(verb: Everbs) {}
  },

  results: {
    list: [],

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
    }) {},

    updateItemEndDate({
      itemId,
      endDate
    }: {
      itemId: string;
      endDate?: string;
    }) {}
  },

  themeMode: 'dark',
  toggleTheme() {}
};

export const GlobalStore = React.createContext(DEFAULT_GLOBAL_STORE);
