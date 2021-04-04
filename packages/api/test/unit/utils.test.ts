import test from 'ava';

import { getTimeAverage } from '../../util';

test('getTimeAverage', (t) => {
  const average = getTimeAverage([100, 200, 300]);
  t.is(average, 200);
});
