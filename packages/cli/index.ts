import { oneLine } from 'common-tags';
import { merge } from 'lodash';
import { Command } from 'commander';
import ora from 'ora';
import asciichart from 'asciichart';
import chalk from 'chalk';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { getTimeAverage } from '@clobbr/api/src/util';
import { run } from '@clobbr/api';

import { error, errorMessage, highlightInfo, success } from './src/output/log';
import { renderTable } from './src/output/table';
import { TABLE_TYPES } from './src/enums/table';
import { getDurationColor } from './src/util';
import { getHeaders, getData } from './src/io/io';

const DEFAULTS = {
  method: 'get',
  iterations: '10',
  parallel: false,
  table: TABLE_TYPES.none,
  chart: true,
  headers: {},
  data: {}
};

const runEventCallback = (spinner) => (
  _event: EEvents,
  log: ClobbrLogItem,
  logs: Array<ClobbrLogItem>
) => {
  const { index, statusCode, duration } = log.metas || {};
  const statusOk = statusCode ? statusCode.toString().match(/^2.*/g) : false;
  const rollingAverage = getTimeAverage(
    logs.filter((l) => !l.failed).map((l) => l.metas.duration)
  );

  if (statusOk) {
    spinner.text = oneLine`
      #${index + 1}
      ${chalk.keyword(getDurationColor(duration))(`${duration}ms`)}
      ${chalk.bold.keyword(getDurationColor(rollingAverage))(
        `[${rollingAverage}ms ${chalk.white('μ')}]`
      )}
    `;
    spinner.color = 'green';
  } else {
    spinner.text = `#${index + 1} ${chalk.bold.red('[FAIL]')}`;
    spinner.color = 'red';
  }
};

const program = new Command();

program.name('clobbr').version(require('./package.json').version);

// TODO: program.command('interactive', { isDefault: true });

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
    '-m, --method <method>',
    'request method (verb) to use',
    DEFAULTS.method
  )
  .option(
    '-i, --iterations <iterations>',
    'number of requests to perform',
    DEFAULTS.iterations
  )
  .option(
    '-h, --headersPath <headersPath>',
    'path to headers file (json), to add as request headers.'
  )
  .option(
    '-d, --dataPath <dataPath>',
    'path to data file (json), to add as request body.'
  )
  .option('-p, --parallel', 'run requests in parallel', DEFAULTS.parallel)
  .option('-c, --chart', 'display results as a chart', DEFAULTS.chart)
  .option(
    '-t, --table <table>',
    `display results as a table (${Object.values(TABLE_TYPES).join(', ')})`,
    DEFAULTS.table
  )

  .action(async (cliOptions: { [key: string]: any }) => {
    const {
      parallel,
      iterations,
      method,
      url,
      chart,
      table,
      headersPath,
      dataPath
    } = cliOptions;

    const spinner = ora({
      text: `Starting ${iterations} iterations`,
      spinner: 'dots',
      color: 'green'
    }).start();

    try {
      const headers = await getHeaders(headersPath);
      const data = await getData(dataPath);

      const options = merge(DEFAULTS, {
        iterations,
        url,
        verb: method,
        headers,
        data
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

        highlightInfo(` ${method}`);
        highlightInfo(` ${url}`);
        error(`\n All of the ${iterations} iterations have failed ❌ `);
        console.log(
          `\n Is the url & method correct, or are you missing some data/headers/cookies?`
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
          ` Average response time (μ): ${chalk.keyword(
            getDurationColor(average)
          )(`${average}ms`)}`
        );

        renderTable(failedRequests, okRequests, table);
      }
    } catch (errorMessages) {
      spinner.stop();

      console.error(errorMessages);

      if (Array.isArray(errorMessages)) {
        for (const message of errorMessages) {
          errorMessage(message, { url, method });
        }
      }
    }
  });

program.parse();
