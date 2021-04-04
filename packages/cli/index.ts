import { oneLine } from 'common-tags';
import { merge } from 'lodash';
import { Command } from 'commander';
import ora from 'ora';
import asciichart from 'asciichart';
import chalk from 'chalk';
import { table } from 'table';

import { run } from '@clobbr/api';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import {
  errorMessage,
  highlightError,
  highlightInfo,
  highlightSuccess
} from './src/output';
import { EEvents } from '@clobbr/api/src/enums/events';

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
  const { index, statusCode } = payload.metas || {};
  spinner.text = `#${index + 1}`;
  spinner.color = statusCode === 200 ? 'green' : 'red';
  // TODO show avg
};

const getLogItemTableRow = (logItem: ClobbrLogItem) => {
  const { metas, url, verb, error } = logItem;
  const status = error
    ? chalk.bold.red(error.code ? error.code : metas.status)
    : chalk.bold.green(metas.status);
  const duration = error ? '-' : metas.duration;

  return [verb.toUpperCase(), url, metas.number, status, duration];
};

const renderTable = (
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>
) => {
  if (ok.length) {
    highlightSuccess(`\n\nCompleted iterations: ${ok.length}`);
    console.log(
      table([
        ['Method', 'URL', 'Number', 'Status', 'Duration'].map((t) =>
          chalk.bold(t)
        ),
        ...ok.map(getLogItemTableRow)
      ])
    );
  }

  if (failed.length) {
    highlightError(`\n\nFailed iterations: ${failed.length}`);
    console.log(
      table([
        ['Method', 'URL', 'Number', 'Status', 'Duration'].map((t) =>
          chalk.bold(t)
        ),
        ...failed.map(getLogItemTableRow)
      ])
    );
  }
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

      const { results, logs, average } = await run(
        parallel,
        options,
        runEventCallback(spinner)
      );
      spinner.stop();

      const allFailed = results.length === 0;
      const failedRequests = logs.filter(({ failed }) => failed);
      const okRequests = logs.filter(({ failed }) => !failed);

      if (allFailed) {
        console.log('\n');

        highlightInfo(` ${verb}`);
        highlightInfo(` ${url}`);
        highlightError(
          `\n All of the ${iterations} iterations have failed ❌ `
        );
        console.log(
          `\n Is the url & verb correct, or are you missing some data/headers/cookies?`
        );

        renderTable(failedRequests, []);
      } else {
        // TODO autoresize?
        if (results.length) {
          console.log('\n');
          console.log(
            asciichart.plot(results, {
              height: 15,
              colors: [asciichart.green, asciichart.blue]
            })
          );
          console.log('\n');
        }

        highlightSuccess(`\n Finished run of ${results.length} iterations ✅ `);

        if (failedRequests.length) {
          highlightError(
            `\n ${failedRequests.length} iterations have failed ❌ `
          );
        }

        console.log(
          ` Average response time: ${chalk[getDurationColor(average)](
            `${average}ms`
          )}`
        );

        // todo only verbose should show each req as a table?
        renderTable(failedRequests, okRequests);
      }
    } catch (errorMessages) {
      spinner.stop();

      console.error(errorMessages);

      if (Array.isArray(errorMessages)) {
        for (const message of errorMessages) {
          errorMessage(message, { url, verb });
        }
      }
    }
  });

program.parse();
