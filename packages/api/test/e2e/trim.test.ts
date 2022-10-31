import test from 'ava';

import { UNTRIMMED_COMMENTS_PATH } from './mock/rest-api';

import { runSequence } from '../../src/sequence';
import { runParallel } from '../../src/parallel';
import { VERBS } from '../../src/enums/http';

test('should trim urlwhen running in sequence', (t) => {
  return runSequence({
    iterations: 1,
    url: UNTRIMMED_COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    t.true(Array.isArray(results));
    t.is(logs.length, 1);
    t.true(Number.isInteger(average));
  });
});

test('should trim urlwhen running in parallel', (t) => {
  return runParallel({
    iterations: 1,
    url: UNTRIMMED_COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    t.true(Array.isArray(results));
    t.is(logs.length, 1);
    t.true(Number.isInteger(average));
  });
});
