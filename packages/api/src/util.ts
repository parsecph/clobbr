import { AxiosError, AxiosResponse } from 'axios';
import {
  ClobbrLogItemFailedMessage,
  ClobbrLogItemMeta
} from './models/ClobbrLog';
import { ENV } from './settings';

const sizeof = require('object-sizeof');

export const getNumberMeta = (index: number) => {
  return `#${(index + 1).toString().padStart(3, '0')}`;
};

export const getFailedMessage = (
  index: number,
  error: AxiosError
): ClobbrLogItemFailedMessage => {
  const baseError = `${getNumberMeta(index)}: Failed`;

  try {
    const { status, statusText } = error.response as AxiosResponse;

    if (ENV.VERBOSE) {
      console.error(error);
    }

    return {
      formatted: `${baseError} ${status} (${statusText})`,
      status: `${status} (${statusText})`,
      statusText
    };
  } catch {}

  return { formatted: baseError };
};

export const getResponseMetas = (
  response: AxiosResponse,
  duration: number,
  index: number
): ClobbrLogItemMeta => {
  const { status, statusText, data } = response;

  const statusOk = status ? !!status.toString().match(/^2.*/g) : false;

  const metas = {
    number: getNumberMeta(index),
    status: `${status} (${statusText})`,
    statusCode: status,
    statusOk,
    index,
    duration,
    durationUnit: 'ms',
    size: `${sizeof(data) / 1000} KB`,
    data
  };

  return metas;
};

export const getTimeAverage = (durations: Array<number>) => {
  return Math.round(
    durations.reduce((acc: number, cur: number) => acc + cur, 0) /
      durations.length || 0
  );
};
