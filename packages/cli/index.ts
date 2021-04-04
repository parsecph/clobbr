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
  error,
  errorMessage,
  highlightError,
  highlightInfo,
  highlightSuccess,
  success
} from './src/output';
import { EEvents } from '@clobbr/api/src/enums/events';

enum ETableTypes {
  NONE = 'none',
  COMPACT = 'compact',
  FULL = 'full'
}

const TABLE_TYPES = {
  none: ETableTypes.NONE,
  compact: ETableTypes.COMPACT,
  full: ETableTypes.FULL
};

const DEFAULTS = {
  verb: 'get',
  iterations: '10',
  parallel: false,
  table: TABLE_TYPES.none,
  chart: true
};

const COLOR_MAP = {
  0: 'green',
  1: 'yellow',
  2: 'orange',
  3: 'redBright'
};

export const getDurationColor = (duration) => {
  return COLOR_MAP[Math.round(duration / 1000)] || 'red';
};

const runEventCallback = (spinner) => (event: EEvents, payload) => {
  // TODO show avg on a rolling basis
  const { index, statusCode } = payload.metas || {};
  spinner.text = `#${index + 1}`;
  spinner.color = statusCode === 200 ? 'green' : 'red';
};

const getLogItemTableRow = (logItem: ClobbrLogItem) => {
  const { metas, error } = logItem;

  const status = error
    ? chalk.bold.red(metas.status)
    : chalk.bold.green(metas.status);
  const duration = error
    ? '-'
    : chalk.keyword(getDurationColor(metas.duration))(
        `${metas.duration} ${metas.durationUnit}`
      );
  const size = error ? '-' : metas.size;

  return [metas.number, status, duration, size];
};

const renderTable = (
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>,
  tableType: ETableTypes
) => {
  if (tableType === TABLE_TYPES.none) {
    return;
  }

  const tableHeader = ['Number', 'Status', 'Duration', 'Size'].map((t) =>
    chalk.bold(t)
  );

  const tableOptions = {
    drawHorizontalLine: (index: number, size: number) => {
      if (index === 0 || index === size || tableType === TABLE_TYPES.full) {
        return true;
      }

      return false;
    }
  };

  if (ok.length) {
    highlightSuccess(`\n\nCompleted iterations: ${ok.length}`);
    console.log(
      table([tableHeader, ...ok.map(getLogItemTableRow)], tableOptions)
    );
  }

  if (failed.length) {
    highlightError(`\n\nFailed iterations: ${failed.length}`);
    console.log(
      table([tableHeader, ...failed.map(getLogItemTableRow)], tableOptions)
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
  .option(
    '-v, -m, --method <method>, --verb <verb>',
    'request verb/method to use',
    DEFAULTS.verb
  )
  .option(
    '-i, --iterations <iterations>',
    'number of requests to perform',
    DEFAULTS.iterations
  )
  .option('-p, --parallel', 'run requests in parallel', DEFAULTS.parallel)
  .option('-c, --chart', 'display results as chart', DEFAULTS.chart)
  .option(
    '-t, --table <table>',
    `display results as table (${Object.values(TABLE_TYPES).join(', ')})`,
    DEFAULTS.table
  )

  .action(async (cliOptions: { [key: string]: any }) => {
    const { parallel, iterations, verb, url, chart, table } = cliOptions;
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
        error(`\n All of the ${iterations} iterations have failed ❌ `);
        console.log(
          `\n Is the url & verb correct, or are you missing some data/headers/cookies?`
        );

        renderTable(failedRequests, [], table);
      } else {
        // TODO autoresize?
        if (results.length && chart) {
          console.log('\n');
          console.log(
            asciichart.plot(results, {
              height: 15,
              width: 20,
              colors: [asciichart.green, asciichart.blue]
            })
          );
          console.log('\n');
        }

        success(`\n Finished run of ${results.length} iterations ✅ `);

        if (failedRequests.length) {
          error(`\n ${failedRequests.length} iterations have failed ❌ `);
        }

        console.log(
          ` Average response time: ${chalk.keyword(getDurationColor(average))(
            `${average}ms`
          )}`
        );

        renderTable(failedRequests, okRequests, table);
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
