import { json2csv } from 'json-2-csv';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { sanitizeMetas } from './util';

export const getCsv = async (
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>,
  _stats: Array<{ value: string | number; label: string }>
) => {
  // TODO: what to do with stats
  const csvData = await json2csv(
    [...failed.map(sanitizeMetas), ...ok.map(sanitizeMetas)],
    {
      unwindArrays: true,
      delimiter: {
        field: ';'
      }
    }
  );

  return csvData;
};
