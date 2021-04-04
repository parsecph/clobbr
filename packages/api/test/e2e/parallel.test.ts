import test from 'ava';

import { COMMENTS_PATH } from './mock/rest-api';

import { runParallel } from '../../src/parallel';
import { VERBS } from '../../src/enums/http';
import { COMMENT } from './mock/comment';

test('GET one in parallel', (t) => {
  return runParallel({
    iterations: 1,
    url: COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    t.true(Array.isArray(results));
    t.is(logs.length, 1);
    t.true(Number.isInteger(average));
  });
});

test('GET multiple in parallel', (t) => {
  return runParallel({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});

test('POST multiple in parallel', (t) => {
  return runParallel({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.POST,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});

test('PUT multiple in parallel', (t) => {
  return runParallel({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.PUT,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});

test('PATCH multiple in parallel', (t) => {
  return runParallel({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.PATCH,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});

test('DELETE multiple in parallel', (t) => {
  return runParallel({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.DELETE,
    headers: {}
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.not(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );
    t.deepEqual(logs.map(({ metas }) => metas.index).sort(), expectedIndexes);

    t.true(Number.isInteger(average));
  });
});
