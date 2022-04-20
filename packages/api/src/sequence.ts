import { EVENTS } from './enums/events';
import { Everbs } from './enums/http';
import { ClobbrLogItem } from './models/ClobbrLog';
import { ClobbrEventCallback } from './models/ClobbrEvent';
import { ClobbrRequestSettings } from './models/ClobbrRequestSettings';
import { getTimeAverage } from './util';
import { validate } from './validate';
import { handleApiCall, handleApiCallError } from './common';
import { AxiosError } from 'axios';

export const runSequence = async (
  settings: ClobbrRequestSettings,
  eventCallback?: ClobbrEventCallback
) => {
  const { iterations, url, verb = Everbs.GET } = settings;
  const { valid, errors } = validate(url, verb);

  if (!valid) {
    return Promise.reject(errors);
  }

  const results = [] as Array<number>;
  const logs = [] as Array<ClobbrLogItem>;

  for (let index = 0; index < iterations; index++) {
    const runStartTime = new Date().valueOf(); // Only used for fails.

    try {
      const { duration, logItem } = await handleApiCall(index, settings);
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
  }

  return { results, logs, average: getTimeAverage(results) };
};
