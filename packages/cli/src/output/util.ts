import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export const sanitizeMetas = (item: ClobbrLogItem) => {
  delete item.metas.data;
  delete item.error;
  return item;
};
