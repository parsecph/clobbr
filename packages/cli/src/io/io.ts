import path from 'path';
import fs from 'fs';

import { error } from '../output/log';

const { readFile } = fs.promises;

export const getHeaders = async (headersPath: string) => {
  if (!headersPath) {
    return {};
  }

  try {
    const headers = await readFile(path.normalize(headersPath), {
      encoding: 'utf-8'
    });

    return JSON.parse(headers);
  } catch {
    error('Failed to parse headers\n');
    return {};
  }
};

export const getData = async (dataPath: string) => {
  if (!dataPath) {
    return {};
  }

  try {
    const data = await readFile(path.normalize(dataPath), {
      encoding: 'utf-8'
    });

    return JSON.parse(data);
  } catch {
    error('Failed to parse data\n');
    return {};
  }
};
