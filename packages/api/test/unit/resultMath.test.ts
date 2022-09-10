import test from 'ava';

import { mean, median, stdDev, q5, q50, q95, q99 } from '../../src/resultMath';

const arr = [
  120,
  150,
  180,
  210,
  240,
  270,
  300,
  330,
  360,
  390,
  1025,
  1050,
  1075,
  1100,
  1125,
  1150,
  1175,
  1200,
  1225,
  1250
];

test('mean with empty array', (t) => {
  const res = mean([]);
  t.is(res, 0);
});

test('mean with values', (t) => {
  const res = mean(arr);
  t.is(res, 696.25);
});

test('median with empty array', (t) => {
  const res = median([]);
  t.is(res, 0);
});

test('median with values', (t) => {
  const res = median(arr);
  t.is(res, 707.5);
});

test('stdDev with empty array', (t) => {
  const res = stdDev([]);
  t.is(res, 0);
});

test('stdDev with values', (t) => {
  const res = stdDev(arr);
  t.is(res, 459.96817681684297);
});

test('q5 with empty array', (t) => {
  const res = q5([]);
  t.is(res, 0);
});

test('q5 with values', (t) => {
  const res = q5(arr);
  t.is(res, 707.5);
});

test('q50 with empty array', (t) => {
  const res = q50([]);
  t.is(res, 0);
});

test('q50 with values', (t) => {
  const res = q50(arr);
  t.is(res, 707.5);
});

test('q95 with empty array', (t) => {
  const res = q95([]);
  t.is(res, 0);
});

test('q95 with values', (t) => {
  const res = q95(arr);
  t.is(res, 1226.25);
});

test('q99 with empty array', (t) => {
  const res = q99([]);
  t.is(res, 0);
});

test('q99 with values', (t) => {
  const res = q99(arr);
  t.is(res, 1245.25);
});
