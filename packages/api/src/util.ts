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
      statusText,
      statusCode: status
    };
  } catch {}

  return { formatted: baseError };
};

export const getResponseMetas = (
  response: AxiosResponse,
  duration: number,
  index: number,
  includeDataInResponse = false
): { metas: ClobbrLogItemMeta; errors: any } => {
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
    ...(includeDataInResponse ? { data } : {})
  };

  return {
    metas,
    errors: undefined
  };
};

export const getGqlResponseMetas = (
  response: AxiosResponse,
  duration: number,
  index: number,
  includeDataInResponse = false
): {
  metas: ClobbrLogItemMeta;
  errors: any;
} => {
  const { status, statusText, data } = response;

  const { failed, errors } = hasGqlFailed(response);

  const metas = {
    number: getNumberMeta(index),
    status: `${status} (${statusText})`,
    statusCode: status,
    statusOk: !failed,
    index,
    duration,
    durationUnit: 'ms',
    size: `${sizeof(data) / 1000} KB`,
    ...(includeDataInResponse ? { data } : {})
  };

  return {
    metas,
    errors
  };
};

export const getTimeAverage = (durations: Array<number>) => {
  return Math.round(
    durations.reduce((acc: number, cur: number) => acc + cur, 0) /
      durations.length || 0
  );
};

export const hasGqlFailed = (response: AxiosResponse) => {
  try {
    const possibleErrorObjectLocations = [response, response.data];

    for (const possibleErrorObjectLocation of possibleErrorObjectLocations) {
      const { data } = possibleErrorObjectLocation;
      const { errors } = data;

      const firstKey = Object.keys(data)[0];

      if (!!errors?.length) {
        return { failed: true, errors };
      }

      if (!!data[firstKey].errors?.length) {
        return { failed: true, errors: data[firstKey].errors };
      }
    }
  } catch (error) {
    console.error('Failed to get GQL error', error);
    return { failed: false, errors: [] };
  }

  return { failed: false, errors: [] };
};
