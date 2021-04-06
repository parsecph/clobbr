import chalk from 'chalk';
import { table } from 'table';

import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

import { ETableTypes, TABLE_TYPES } from '../enums/table';
import { highlightError, highlightSuccess } from './log';
import { getDurationColor } from '../util';

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
