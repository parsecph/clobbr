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

const requestDb = localforage.createInstance({
  name: DB_NAME,
  storeName: EDbStores.REQUEST_STORE_NAME,
  description: 'Holds request data'
});

const resultDb = localforage.createInstance({
  name: DB_NAME,
  storeName: EDbStores.RESULT_STORE_NAME,
  description: 'Holds result data'
});

export const getDb = (type: EDbStores) => {
  const _getDb = () => {
    switch (type) {
      case EDbStores.MAIN_STORE_NAME:
        return mainDb;
      case EDbStores.REQUEST_STORE_NAME:
        return requestDb;
      case EDbStores.RESULT_STORE_NAME:
        return resultDb;
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

  return {
    getKeys,
    getItem,
    setItem,
    removeItem
  };
};
