import { stripIndent } from 'common-tags';
import { error, highlightError } from './output';

const { Command } = require('commander');

const program = new Command();

program.version(require('./package.json').version);

program
  .command('run <url>')
  .option('-i, --iterations', 'number of requests to perform', 10)
  .option('-p, --parallel', 'run requests in parallel', false)
  .description(
    'test an api endpoint (<url>), providing options. Run "help run" to see all available options'
  )
  .action((url: string, options) => {
    try {
      const result = run(url, options);
    } catch (error) {
      highlightError(`${url}`);
      error(stripIndent`
        Invalid http/https url. Accepted formats:
        ➡️  http://domain.com/optional-path
        ➡️  https://domain.com/optional-path
      `);
    }

    console.log(url, options);
  });

program.parse();
