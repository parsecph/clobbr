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
    : chalk.keyword(getDurationColor(metas.duration))(
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
  tableType: ETableTypes = TABLE_TYPES.compact
) => {
  const qualifiedDurations = ok.map((r) => r.metas.duration);

  const tableHeader = [
    'Average (Mean)',
    'Standard Deviation',
    '5th percentile',
    '95th percentile',
    '99th percentile'
  ].map((t) => chalk.bold(t));

  const meanValue = mean(qualifiedDurations);
  const stdValue = stdDev(qualifiedDurations);
  const q5Value = q5(qualifiedDurations);
  const q95Value = q95(qualifiedDurations);
  const q99Value = q99(qualifiedDurations);

  const stats = [
    chalk.keyword(getDurationColor(meanValue))(`${formatNumber(meanValue)} ms`),
    chalk.keyword(getDurationColor(stdValue))(`${formatNumber(stdValue)} ms`),
    chalk.keyword(getDurationColor(q5Value))(`${formatNumber(q5Value)} ms`),
    chalk.keyword(getDurationColor(q95Value))(`${formatNumber(q95Value)} ms`),
    chalk.keyword(getDurationColor(q99Value))(`${formatNumber(q99Value)} ms`)
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
  }
};
