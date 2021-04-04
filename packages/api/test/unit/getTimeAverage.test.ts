import test from 'ava';

import { getTimeAverage } from '../../src/util';

test('with empty array', (t) => {
  const average = getTimeAverage([]);
  t.is(average, 0);
});

test('with values', (t) => {
  const average = getTimeAverage([100, 200, 300]);
  t.is(average, 200);
});
