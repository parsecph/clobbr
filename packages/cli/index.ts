import { oneLine } from 'common-tags';
import { merge, isEmpty } from 'lodash';
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { EEvents } from '@clobbr/api/src/enums/events';
import { getTimeAverage } from '@clobbr/api/src/util';
import { run, mathUtils } from '@clobbr/api';

import {
  error,
  errorMessage,
  highlightInfo,
  success,
  warn
} from './src/output/log';
import { renderStatsTable, renderTable } from './src/output/table';
import { renderChart } from './src/output/chart';
import { renderFormattedOutput } from './src/output/output';
import { TABLE_TYPES } from './src/enums/table';
import { OUTPUT_TYPES } from './src/enums/outputs';
import { PCT_OF_SUCCESS_KEY } from './src/consts/pctOfSuccess';
import { getDurationColor } from './src/util';
import { getHeaders, getData } from './src/io/io';
import { runChecks, renderCheckResults } from './src/checks/runChecks';

const DEFAULTS = {
  method: 'get',
  iterations: '10',
  parallel: false,
  table: TABLE_TYPES.none,
  output: OUTPUT_TYPES.visual,
  outputFile: false,
  chart: true,
  headers: {},
  data: {}
};

const getAvailableChecks = () => {
  const mathChecks = Object.keys(mathUtils).map((key) => `${key} (max ms)`);
  return `${[...mathChecks, `${PCT_OF_SUCCESS_KEY} (0-100)`].join(', ')}`;
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
    `request method (verb) to use.`,
    DEFAULTS.method
  )
  .option(
    '-i, --iterations <iterations>',
    `number of requests to perform.`,
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
  .option('-p, --parallel', `run requests in parallel.`, DEFAULTS.parallel)
  .option('-c, --chart', `display results as a chart.`, DEFAULTS.chart)
  .option(
    '-t, --table <table>',
    `type of table to display for the ${
      OUTPUT_TYPES.visual
    } output format: (${Object.values(TABLE_TYPES).join(', ')}).`,
    DEFAULTS.table
  )
  .option(
    '-of, --outputFormat <outputFormat>',
    `output format: (${Object.values(OUTPUT_TYPES).join(', ')}).`,
    DEFAULTS.output
  )
  .option(
    '-out, --outputFile <outputFile>',
    `if option set the result will be output as a file. Can optionally pass a filename to use with this option. Outputs as json if no output format is specified.`,
    DEFAULTS.outputFile
  )
  .option(
    '-ck, --checks <checks...>',
    `checks to be made on the results. Can have multiple values. Available checks: ${getAvailableChecks()}.`,
    DEFAULTS.outputFile
  )
  .option('-dbg, --debug', `output debug logs with full request/response data.`)

  .action(async (cliOptions: { [key: string]: any }) => {
    const {
      parallel,
      iterations,
      method,
      url,
      chart,
      table: tableType,
      headersPath,
      dataPath,
      outputFormat,
      outputFile,
      checks,
      debug
    } = cliOptions;

    const spinner = ora({
      text: `Starting ${iterations} iterations`,
      spinner: 'dots',
      color: 'green'
    }).start();

    try {
      const methodAcceptsBody = ['post', 'put', 'patch'].includes(
        method.toLowerCase()
      );

      const headers = await getHeaders(headersPath);
      const data = await getData(dataPath);

      if (data && !isEmpty(data) && !methodAcceptsBody) {
        warn(
          `\nThe method ${method} does not accept a body, but a data file was provided.\n`
        );
      }

      const options = merge(DEFAULTS, {
        iterations,
        url,
        verb: method,
        headers,
        data
      });

      const { results, logs } = await run(
        parallel,
        options,
        runEventCallback(spinner)
      );
      spinner.stop();

      if (debug) {
        console.log(JSON.stringify(logs, null, 2));
      }

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

        if (outputFormat === OUTPUT_TYPES.visual) {
          renderTable(failedRequests, [], tableType);
        } else {
          await renderFormattedOutput(
            failedRequests,
            [],
            outputFormat,
            outputFile
          );
        }
      } else {
        if (outputFormat === OUTPUT_TYPES.visual) {
          if (chart) {
            renderChart(results);
          }

          renderStatsTable(failedRequests, okRequests);

          success(`\n Finished run of ${results.length} iterations ✅ `);

          if (failedRequests.length) {
            error(`\n ${failedRequests.length} iterations have failed ❌ `);
          }

          renderTable(failedRequests, okRequests, tableType);
        } else {
          await renderFormattedOutput(
            failedRequests,
            okRequests,
            outputFormat,
            outputFile
          );
        }
      }

      if (checks.length) {
        const checkResults = await runChecks(
          checks,
          failedRequests,
          okRequests
        );

        console.log('\n');
        renderCheckResults(checkResults);
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
