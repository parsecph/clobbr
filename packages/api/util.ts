import { AxiosError } from 'axios';

const sizeof = require('object-sizeof');

export const getNumberMeta = (index: number) => {
  return `#${(index + 1).toString().padStart(3, '0')}`;
};

export const getFailedMessage = (index: number, error: AxiosError) => {
  const baseError = `${getNumberMeta(index)}: Failed`;

  try {
    const { status, statusText } = error.response;

    console.log(error);

    return {
      formatted: `${baseError} ${status} (${statusText})`,
      status,
      statusText
    };
  } catch {}

  return baseError;
};

export const getResponseMetas = (response, duration, index) => {
  const metas = {
    number: getNumberMeta(index),
    status: `${response.status} (${response.statusText})`,
    statusCode: response.status,
    index,
    duration: `${duration}ms`,
    size: `${sizeof(response.data) / 1000} KB`
  };

  return metas;
};

export const getTimeAverage = (durations) => {
  return Math.round(
    durations.reduce((acc, cur) => acc + cur, 0) / durations.length
  );
};
