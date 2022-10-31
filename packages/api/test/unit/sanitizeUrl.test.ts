import test from 'ava';

import { sanitizeUrl } from '../../src/sanitize';

test('should trim url start', (t) => {
  const result = sanitizeUrl(' https://url.com/comments');
  t.is(result, 'https://url.com/comments');
});

test('should trim url end', (t) => {
  const result = sanitizeUrl(' https://url.com/comments ');
  t.is(result, 'https://url.com/comments');
});
