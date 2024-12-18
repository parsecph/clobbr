import localforage from 'localforage';
import { EDbStores } from './EDbStores';

export const APP_NAME = 'clobbr';
export const DB_NAME = 'clobbr_db';

export const DB_VERSION = 1;

localforage.config({
  name: APP_NAME,
  version: DB_VERSION
});

const mainDb = localforage.createInstance({
  name: DB_NAME,
  storeName: EDbStores.MAIN_STORE_NAME,
  description: 'Holds global, generic data'
});

// @deprecated
const resultDb = localforage.createInstance({
  name: DB_NAME,
  storeName: EDbStores.RESULT_STORE_NAME,
  description: 'Holds result data'
});

// @deprecated
const resultResponseDb = localforage.createInstance({
  name: DB_NAME,
  storeName: EDbStores.RESULT_LOGS_STORE_NAME,
  description: 'Holds result response data'
});

export interface IStorage {
  getKeys: () => Promise<string[]>;
  getItem: (itemName: string) => Promise<any>;
  setItem: (itemName: string, item: any) => Promise<any>;
  removeItem: (itemName: string) => Promise<any>;
  clear: () => Promise<void>;
}

export const getDb = (type: EDbStores) => {
  const _getDb = () => {
    switch (type) {
      case EDbStores.MAIN_STORE_NAME:
        return mainDb;
      case EDbStores.RESULT_STORE_NAME:
        return resultDb;
      case EDbStores.RESULT_LOGS_STORE_NAME:
        return resultResponseDb;
      default:
        return mainDb;
    }
  };

  const getItem = (itemName: string): Promise<any> =>
    _getDb().getItem(itemName);

  const setItem = (itemName: string, item: any): Promise<any> =>
    _getDb().setItem(itemName, item);

  const removeItem = (itemName: string): Promise<any> =>
    _getDb().removeItem(itemName);

  const getKeys = (): Promise<string[]> => _getDb().keys();

  const clear = (): Promise<void> => _getDb().clear();

  return {
    getKeys,
    getItem,
    setItem,
    removeItem,
    clear
  };
};
