import chalk from 'chalk';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { mathUtils } from '@clobbr/api';
import { EOutputTypes } from '../enums/outputs';
import { getJSON } from './json';
import { getCsv } from './csv';
import { getYAML } from './yaml';
import fs from 'fs';
import { success } from './log';

const { mean, q5, q95, q99, stdDev } = mathUtils;

export const renderFormattedOutput = async (
  failed: Array<ClobbrLogItem>,
  ok: Array<ClobbrLogItem>,
  outputFormat: EOutputTypes,
  outputFile: string | boolean
) => {
  const qualifiedDurations = ok.map((i) => i.metas.duration);

  const stats = [
    {
      value: mean(qualifiedDurations),
      label: 'Average (Mean)'
    },
    {
      value: stdDev(qualifiedDurations),
      label: 'Standard Deviation'
    },
    { value: q5(qualifiedDurations), label: '5th percentile' },
    { value: q95(qualifiedDurations), label: '95th percentile' },
    { value: q99(qualifiedDurations), label: '99th percentile' }
  ];

  let output;

  switch (outputFormat) {
    case EOutputTypes.JSON:
      output = getJSON(failed, ok, stats);
      break;
    case EOutputTypes.CSV:
      output = await getCsv(failed, ok, stats);
      break;
    case EOutputTypes.YAML:
      output = getYAML(failed, ok, stats);
      break;
    default:
      output = getJSON(failed, ok, stats);
  }

  if (outputFile) {
    const filename =
      outputFile === 'true' ? `clobbr-output-${Date.now()}` : outputFile;
    const filepath = `${process.cwd()}/${filename}.${outputFormat}`;
    fs.writeFileSync(filepath, output);
    success(`\n Output written to ${chalk.bold(filepath)}\n`);
  } else {
    console.log(output);
  }

  return null;
};
