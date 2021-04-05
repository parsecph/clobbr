const path = require('path');
const fs = require('fs');
const { exec } = require('pkg');
const { name, version } = require('../package.json');
const packageDir = path.resolve(__dirname, '../binaries');
const entry = path.resolve(__dirname, '../dist/index.js');
const targets = ['node12-linux-x64', 'node12-macos-x64', 'node12-win-x64'];
const baseName = `${name}-${version}`.replace(/\./g, '-');

if (!fs.existsSync(packageDir)) {
  fs.mkdirSync(packageDir);
}

const packageCode = async () => {
  await exec([
    entry,
    '--target',
    targets[0],
    '--output',
    `${packageDir}/${baseName}-linux`
  ]);
  console.log(`Packaged for linux`);

  await exec([
    entry,
    '--target',
    targets[1],
    '--output',
    `${packageDir}/${baseName}-macos`
  ]);
  console.log(`Packaged for mac`);

  await exec([
    entry,
    '--target',
    targets[2],
    '--output',
    `${packageDir}/${baseName}-windows.exe`
  ]);
  console.log(`Packaged for windows`);
};

packageCode();
