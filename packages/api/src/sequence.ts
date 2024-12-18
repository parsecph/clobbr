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

export const runSequence = async (
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

  for (let index = 0; index < iterations; index++) {
    const runStartTime = new Date().valueOf();
    const abortController = abortControllers?.[index];

    // Check if already aborted
    if (abortController?.signal.aborted) {
      const { logItem } = handleApiCallError(
        settings,
        new AxiosError('Request aborted', 'ABORT'),
        index,
        runStartTime
      );
      logs.push(logItem);

      if (eventCallback) {
        eventCallback(EVENTS.RESPONSE_FAILED, logItem, logs);
      }

      break;
    }

    try {
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

      // Break loop if request was aborted
      if ((error as AxiosError)?.name === 'CanceledError') {
        break;
      }
    }
  }

  return { results, logs, average: getTimeAverage(results) };
};
