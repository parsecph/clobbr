import test from 'ava';
import { handleApiCall, handleApiCallError } from '../../src/common';
import { ClobbrRequestSettings } from '../../src/models/ClobbrRequestSettings';
import axios from 'axios';
import { Everbs } from '../../src/enums/http';

test('handleApiCall success', async (t) => {
  const settings: ClobbrRequestSettings = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    verb: Everbs.GET,
    iterations: 1,
    headers: {},
    data: {},
    timeout: 5000,
    includeDataInResponse: false
  };

  const { logItem, duration, abortController } = await handleApiCall(
    0,
    settings
  );
  t.truthy(logItem);
  t.truthy(duration);
  t.truthy(abortController);
});

test('handleApiCallError', (t) => {
  const settings: ClobbrRequestSettings = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    verb: Everbs.GET,
    headers: {},
    data: {},
    timeout: 5000,
    iterations: 1,
    includeDataInResponse: false
  };

  const error = new axios.AxiosError('Request failed');
  const runStartTime = new Date().valueOf();
  const { logItem } = handleApiCallError(settings, error, 0, runStartTime);
  t.truthy(logItem);
  t.true(logItem.failed);
});
