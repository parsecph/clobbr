import test from 'ava';

import { COMMENTS_PATH } from './mock/rest-api';

import { runParallel } from '../../src/parallel';
import { VERBS } from '../../src/enums/http';

test('GET one in parallel', (t) => {
  return runParallel({
    iterations: 1,
    url: COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    t.is(logs.length, 1);

    t.true(Number.isInteger(average));
  });
});

test('GET multiple in parallel', (t) => {
  return runParallel({
    iterations: 10,
    url: COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    t.true(Array.isArray(results));

    t.is(logs.length, 10);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});
