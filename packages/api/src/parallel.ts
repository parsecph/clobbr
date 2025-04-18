import { EVENTS } from './enums/events';
import { Everbs } from './enums/http';
import { ClobbrLogItem } from './models/ClobbrLog';
import { ClobbrEventCallback } from './models/ClobbrEvent';
import { ClobbrRequestSettings } from './models/ClobbrRequestSettings';
import { getTimeAverage } from './util';
import { validate } from './validate';
import { handleApiCall, handleApiCallError } from './common';
import { AxiosError } from 'axios';
import { sanitizeUrl } from './sanitize';

export const runParallel = async (
  settings: ClobbrRequestSettings,
  eventCallback?: ClobbrEventCallback,
  abortControllers?: Array<AbortController>
) => {
  const { iterations, url, verb = Everbs.GET } = settings;
  const sanitizedUrl = sanitizeUrl(url);
  const { valid, errors } = validate(sanitizedUrl, verb);

  if (!valid) {
    return Promise.reject(errors);
  }

  const results = [] as Array<number>;
  const logs = [] as Array<ClobbrLogItem>;

  const requests = Array.from({ length: iterations }).map(async (_v, index) => {
    const runStartTime = new Date().valueOf(); // Only used for fails.

    try {
      const abortController = abortControllers?.[index];

      const { duration, logItem } = await handleApiCall(
        index,
        settings,
        abortController
      );
      results.push(duration);
      logs.push(logItem);

      if (eventCallback) {
        eventCallback(EVENTS.RESPONSE_OK, logItem, logs);
      }
    } catch (error) {
      const { logItem } = handleApiCallError(
        settings,
        error as AxiosError,
        index,
        runStartTime
      );
      logs.push(logItem);

      if (eventCallback) {
        eventCallback(EVENTS.RESPONSE_FAILED, logItem, logs);
      }
    }
  });

  await Promise.all(requests);
  return { results, logs, average: getTimeAverage(results) };
};
