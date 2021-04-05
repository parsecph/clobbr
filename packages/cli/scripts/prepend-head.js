const path = require('path');
const prependFile = require('prepend-file');
const entry = path.resolve(__dirname, '../dist/index.js');

(async () => {
  await prependFile(entry, '#!/usr/bin/env node\n');
  console.log('Preprended headers')
})();
