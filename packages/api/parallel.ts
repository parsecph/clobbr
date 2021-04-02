import api from './api';
import { EVERBS } from './enums/http';
import { ClobbrRunSettings } from './models/ClobbrRunSettings';
import { getFailedMessage, getResponseMetas } from './util';
import { validate } from './validate';

export const runParallel = async ({
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

  const requests = Array.from({ length: iterations }).map(async (_v, index) => {
    try {
      const startTime = new Date().valueOf();
      const res = await api.http[verb](url, { headers });
      const endTime = new Date().valueOf();
      const duration = endTime - startTime;
      const metas = getResponseMetas(res, duration, index);

      results.push(duration);
      logs.push({
        formatted: `${metas.number}: ${metas.duration} ${metas.status} ${metas.size}`
      });
    } catch (error) {
      logs.push({
        formatted: getFailedMessage(index, error),
        failed: true,
        error
      });
    }
  });

  await Promise.all(requests);
  return { results, logs };
};
