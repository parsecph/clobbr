import { oneLine } from 'common-tags';
import { merge } from 'lodash';
import { run } from '@clobbr/api';
import { errorMessage } from './src/output';
import { Command } from 'commander';
import { EEvents } from '@clobbr/api/src/enums/events';
import ora from 'ora';
import asciichart from 'asciichart';
import chalk from 'chalk';

const DEFAULTS = {
  verb: 'get',
  iterations: '10',
  parallel: false
};

const COLOR_MAP = {
  0: 'green',
  1: 'yellowBright',
  2: 'redBright'
};

export const getDurationColor = (duration) => {
  return COLOR_MAP[Math.round(duration / 1000)] || 'red';
};

const runEventCallback = (spinner) => (event: EEvents, payload) => {
  const { index, statusCode } = payload.metas;
  spinner.text = `#${index + 1}`;
  spinner.color = statusCode === 200 ? 'green' : 'red';
  // TODO show avg
};

const program = new Command();

program.version(require('./package.json').version);

// program.command('interactive', { isDefault: true });

program
  .command('run')
  .description(
    oneLine`
      Test an api endpoint/url (<url>),
      Valid urls begin with http(s)://
    `
  )

  .requiredOption('-u, --url <url>', 'url to test')
  .option('-v, --verb <verb>', 'request verb/method to use', DEFAULTS.verb)
  .option(
    '-i, --iterations <iterations>',
    'number of requests to perform',
    DEFAULTS.iterations
  )
  .option('-p, --parallel', 'run requests in parallel', DEFAULTS.parallel)

  .action(async (cliOptions: { [key: string]: any }) => {
    const { parallel, iterations, verb, url } = cliOptions;
    const spinner = ora({
      text: `Starting ${iterations} iterations`,
      spinner: 'dots',
      color: 'green'
    }).start();

    try {
      const options = merge(DEFAULTS, {
        iterations,
        url,
        verb,
        headers: {}
      });

      const { results, average } = await run(
        parallel,
        options,
        runEventCallback(spinner)
      );
      spinner.stop();

      // TODO autoresize?
      console.log('\n');
      console.log(
        asciichart.plot(results, {
          height: 15,
          colors: [asciichart.green, asciichart.blue]
        })
      );
      console.log('\n');

      console.log(`\n Finished run of ${iterations} iterations ✅`);
      console.log(
        ` Average response time: ${chalk[getDurationColor(average)](
          `${average}ms`
        )}`
      );
    } catch (errorMessages) {
      spinner.stop();

      console.error(errorMessages);

      for (const message of errorMessages) {
        errorMessage(message, { url, verb });
      }
    }
  });

program.parse();
