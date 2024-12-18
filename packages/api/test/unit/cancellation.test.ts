import test from 'ava';
import axios from 'axios';
import { handleApiCall } from '../../src/common';
import { ClobbrRequestSettings } from '../../src/models/ClobbrRequestSettings';
import { Everbs } from '../../src/enums/http';

test('request can be cancelled', async (t) => {
  const settings: ClobbrRequestSettings = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    verb: Everbs.GET,
    iterations: 1,
    headers: {},
    data: {},
    timeout: 5000,
    includeDataInResponse: false
  };

  const abortControllers = [new AbortController()];
  const { abortController } = await handleApiCall(
    0,
    settings,
    abortControllers[0]
  );
  t.truthy(abortController);

  abortController.abort();
  try {
    await axios.get(settings.url, { signal: abortController.signal });
  } catch (error) {
    t.true(axios.isCancel(error));
  }
});
