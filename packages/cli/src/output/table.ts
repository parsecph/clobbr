import { isNumber } from 'lodash';
import chalk from 'chalk';
import { table } from 'table';

import { mathUtils } from '@clobbr/api';
import { formatNumber, getDurationColor } from '../util';

const { mean, q5, q95, q99, stdDev } = mathUtils;

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

import { ETableTypes, TABLE_TYPES } from '../enums/table';
import { highlightError, highlightSuccess } from './log';

export const getLogItemTableRow = (logItem: ClobbrLogItem) => {
  const { metas, error } = logItem;

  const status = error
    ? chalk.bold.red(metas.status)
    : chalk.bold.green(metas.status);
  const duration = error
    ? '-'
    : chalk.hex(getDurationColor(metas.duration))(
        `${metas.duration} ${metas.durationUnit}`
      );
  const size = error ? '-' : metas.size;

  return [metas.number, status, duration, size];
};

export const renderTable = (
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

export const renderStatsTable = (
  _failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>,
  tableType: ETableTypes = TABLE_TYPES.compact,
  startTimestamp?: number,
  endTimestamp?: number
) => {
  const qualifiedDurations = ok.map((r) => r.metas.duration);
  const totalTime =
    isNumber(startTimestamp) && isNumber(endTimestamp)
      ? endTimestamp - startTimestamp
      : 0;
  const totalTimeInSeconds = totalTime;

  const tableHeader = [
    'Average (Mean)',
    'Standard Deviation',
    '5th percentile',
    '95th percentile',
    '99th percentile',
    ...(totalTimeInSeconds ? ['Total time'] : [])
  ].map((t) => chalk.bold(t));

  const meanValue = mean(qualifiedDurations) || 0;
  const stdValue = stdDev(qualifiedDurations) || 0;
  const q5Value = q5(qualifiedDurations) || 0;
  const q95Value = q95(qualifiedDurations) || 0;
  const q99Value = q99(qualifiedDurations) || 0;

  const stats = [
    chalk.green(`${formatNumber(meanValue)} ms`),
    stdValue ? chalk.green(`${formatNumber(stdValue)} ms`) : '-',
    chalk.green(`${formatNumber(q5Value)} ms`),
    chalk.green(`${formatNumber(q95Value)} ms`),
    chalk.green(`${formatNumber(q99Value)} ms`),
    ...(totalTimeInSeconds
      ? [`${formatNumber(totalTimeInSeconds, 0, 0)} ms`]
      : [])
  ];

  const tableOptions = {
    drawHorizontalLine: (index: number, size: number) => {
      if (index === 0 || index === size || tableType === TABLE_TYPES.full) {
        return true;
      }

      return false;
    }
  };

  if (ok.length) {
    console.log(table([tableHeader, stats], tableOptions));
    return [tableHeader, stats];
  }

  return [tableHeader, stats];
};
