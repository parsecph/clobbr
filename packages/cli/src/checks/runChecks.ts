import chalk from 'chalk';
import { isNumber } from 'lodash';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { PCT_OF_SUCCESS_KEY } from '../consts/pctOfSuccess';
import { ClobbrCliCheckResult } from '../models/ClobbrCheckResult';
import { mathUtils } from '@clobbr/api';
import { error, success } from '../output/log';

const parseChecks = (checks: Array<string>) => {
  return checks.map((check) => {
    const [type, value] = check.split('=');
    return {
      type,
      value: parseFloat(value)
    };
  });
};

export const runChecks = (
  checks: Array<string>,
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>
) => {
  let checkResults: Array<ClobbrCliCheckResult> = [];
  const parsedChecks = parseChecks(checks);

  const numberOfResults = failed.length + ok.length;
  const passPercentage = (ok.length / numberOfResults) * 100;
  const pctOfSuccessCheck = parsedChecks.find(
    (check) => check.type === PCT_OF_SUCCESS_KEY
  );

  const qualifiedDurations = ok.map((r) => r.metas.duration);

  if (pctOfSuccessCheck && isNumber(pctOfSuccessCheck.value)) {
    if (passPercentage < pctOfSuccessCheck.value) {
      checkResults.push({
        type: PCT_OF_SUCCESS_KEY,
        value: pctOfSuccessCheck.value,
        actualValue: passPercentage,
        passed: false
      });
    } else {
      checkResults.push({
        type: PCT_OF_SUCCESS_KEY,
        value: pctOfSuccessCheck.value,
        actualValue: passPercentage,
        passed: true
      });
    }
  }

  for (const check of parsedChecks) {
    if (!mathUtils[check.type]) {
      continue;
    }

    const actualValue = mathUtils[check.type](qualifiedDurations);

    if (check.value < actualValue) {
      checkResults.push({
        type: check.type,
        value: check.value,
        actualValue,
        passed: false
      });
    } else {
      checkResults.push({
        type: check.type,
        value: check.value,
        actualValue,
        passed: true
      });
    }
  }

  return checkResults;
};

export const renderCheckResults = (
  checkResults: Array<ClobbrCliCheckResult>
) => {
  const failedChecks = checkResults.filter((check) => !check.passed);
  const passedChecks = checkResults.filter((check) => check.passed);

  success(` ✅  ${passedChecks.length} checks passed`);

  for (const failedCheck of failedChecks) {
    const failedMessage = ` ❌  ${chalk.bold(
      failedCheck.type
    )} check failed. Expected ${chalk.bold(
      failedCheck.value
    )} but got ${chalk.bold(failedCheck.actualValue)}`;

    error(failedMessage);
  }
};
