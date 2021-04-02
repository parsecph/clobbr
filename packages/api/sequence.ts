import api from './api';
import { EVERBS } from './enums/http';
import { ClobbrRunSettings } from './models/ClobbrRunSettings';
import { getFailedMessage, getResponseMetas } from './util';
import { validate } from './validate';

export const runSequence = async ({
  iterations,
  url,
  verb = EVERBS.GET,
  headers
}: ClobbrRunSettings) => {
  if (!validate(url)) {
    throw new Error(`Invalid url ${url}`);
  }

  const results = [];
  const logs = [];

  for (let i = 0; i < iterations; i++) {
    try {
      const startTime = new Date().valueOf();
      const res = await api.http[verb](url, { headers });
      const endTime = new Date().valueOf();
      const duration = endTime - startTime;
      const metas = getResponseMetas(res, duration, i);

      results.push(duration);
      logs.push({
        formatted: `${metas.number}: ${metas.duration} ${metas.status} ${metas.size}`
      });
    } catch (error) {
      logs.push({
        formatted: getFailedMessage(i, error),
        failed: true,
        error
      });
    }
  }

  return { results, logs };
};
