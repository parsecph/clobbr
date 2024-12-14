import test from 'ava';
import { runParallel } from '../../src/parallel';
import { ClobbrRequestSettings } from '../../src/models/ClobbrRequestSettings';
import { EVENTS } from '../../src/enums/events';
import { Everbs } from '../../src/enums/http';

test('eventCallback on success', async (t) => {
  const settings: ClobbrRequestSettings = {
    url: 'https://jsonplaceholder.typicode.com/posts',
    verb: Everbs.GET,
    iterations: 1,
    headers: {},
    data: {},
    timeout: 5000,
    includeDataInResponse: false
  };

  let eventCalled = false;
  const eventCallback = (event: string) => {
    if (event === EVENTS.RESPONSE_OK) {
      eventCalled = true;
    }
  };

  await runParallel(settings, eventCallback);
  t.true(eventCalled);
});

test('eventCallback on failure', async (t) => {
  const settings: ClobbrRequestSettings = {
    url: 'https://invalid.url',
    verb: Everbs.GET,
    iterations: 1,
    headers: {},
    data: {},
    timeout: 5000,
    includeDataInResponse: false
  };

  let eventCalled = false;
  const eventCallback = (event: string) => {
    if (event === EVENTS.RESPONSE_FAILED) {
      eventCalled = true;
    }
  };

  try {
    await runParallel(settings, eventCallback);
  } catch (error) {
    // Expected to fail
  }
  t.true(eventCalled);
});
