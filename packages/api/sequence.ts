import api from './api';
import { EVENTS } from './enums/events';
import { Everbs } from './enums/http';
import { ClobbrEventCallback } from './models/ClobbrEvent';
import { ClobbrRunSettings } from './models/ClobbrRunSettings';
import { getFailedMessage, getResponseMetas, getTimeAverage } from './util';
import { validate } from './validate';

export const runSequence = async (
  { iterations, url, verb = Everbs.GET, headers }: ClobbrRunSettings,
  eventCallback: ClobbrEventCallback = () => null
) => {
  const { valid, errors } = validate(url, verb);

  if (!valid) {
    return Promise.reject(errors);
  }

  const results = [];
  const logs = [];

  for (let index = 0; index < iterations; index++) {
    try {
      const startTime = new Date().valueOf();
      const res = await api.http[verb](url, { headers });
      const endTime = new Date().valueOf();
      const duration = endTime - startTime;
      const metas = getResponseMetas(res, duration, index);
      const logItem = {
        url,
        verb,
        headers,
        formatted: `${metas.number}: ${metas.duration} ${metas.status} ${metas.size}`,
        metas
      };

      results.push(duration);
      logs.push(logItem);
      eventCallback(EVENTS.RESPONSE_OK, logItem);
    } catch (error) {
      logs.push({
        url,
        verb,
        headers,
        metas: { index },
        formatted: getFailedMessage(index, error),
        failed: true,
        error
      });
      eventCallback(EVENTS.RESPONSE_FAILED, { index, error });
    }
  }

  return { results, logs, average: getTimeAverage(results) };
};
