import { stringify } from 'yaml';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { sanitizeMetas } from './util';

export const getYAML = (
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>,
  stats: Array<{ value: string | number; label: string }>
) => {
  const output = stringify(
    {
      failed: failed.map(sanitizeMetas),
      ok: ok.map(sanitizeMetas),
      stats
    },
    null,
    2
  );

  return output;
};
