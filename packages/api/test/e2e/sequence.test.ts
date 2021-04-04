import test from 'ava';

import { COMMENTS_PATH } from './mock/rest-api';

import { runSequence } from '../../src/sequence';
import { VERBS } from '../../src/enums/http';
import { COMMENT } from './mock/comment';

test('GET one in sequence', (t) => {
  return runSequence({
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

test('GET multiple in sequence', (t) => {
  return runSequence({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.GET,
    headers: {}
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.deepEqual(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );

    t.true(Number.isInteger(average));
  });
});

test('POST multiple in sequence', (t) => {
  return runSequence({
    iterations: 5,
    url: COMMENTS_PATH,
    verb: VERBS.POST,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.deepEqual(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );

    t.true(Number.isInteger(average));
  });
});

test('PUT multiple in sequence', (t) => {
  return runSequence({
    iterations: 5,
    url: `${COMMENTS_PATH}/1`,
    verb: VERBS.PUT,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.deepEqual(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );

    t.true(Number.isInteger(average));
  });
});

test('PATCH multiple in sequence', (t) => {
  return runSequence({
    iterations: 5,
    url: `${COMMENTS_PATH}/1`,
    verb: VERBS.PATCH,
    headers: {},
    data: COMMENT()
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.deepEqual(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );

    t.true(Number.isInteger(average));
  });
});

test('DELETE multiple in sequence', (t) => {
  return runSequence({
    iterations: 5,
    url: `${COMMENTS_PATH}/1`,
    verb: VERBS.DELETE,
    headers: {}
  }).then(({ results, logs, average }) => {
    const expectedIndexes = [0, 1, 2, 3, 4];

    t.true(Array.isArray(results));

    t.is(logs.length, 5);
    t.deepEqual(
      logs.map(({ metas }) => metas.index),
      expectedIndexes
    );

    t.true(Number.isInteger(average));
  });
});
