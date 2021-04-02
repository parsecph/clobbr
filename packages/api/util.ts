import { AxiosError } from 'axios';

const sizeof = require('object-sizeof');

// const colorMap = {
//   0: 'green',
//   1: 'yellowBright',
//   2: 'redBright'
// };

// export const getDurationColor = (duration) => {
//   return colorMap[Math.round(duration / 1000)] || 'red';
// };

export const getNumberMeta = (index: number) => {
  // return chalk.white.bgGray(`#${`${index + 1}`.padStart(3, '0')}`);
  return `#${`${index + 1}`.padStart(3, '0')}`;
};

export const getFailedMessage = (index: number, error: AxiosError) => {
  const baseError = `${getNumberMeta(index)}: Failed`;

  try {
    const { status, statusText } = error.response;

    return {
      formatted: `${baseError} ${status} (${statusText})`,
      status,
      statusText
    };
    // return `${baseError} ${chalk.red(`${errorCode} (${errorText})`)}`;
  } catch {}

  return baseError;
};

export const getResponseMetas = (response, duration, index) => {
  // const durationColor = getDurationColor(duration);

  const metas = {
    number: getNumberMeta(index),
    // status: chalk.gray(`${response.status} (${response.statusText})`),
    status: `${response.status} (${response.statusText})`,
    // duration: chalk[durationColor](`${duration}ms`),
    duration: `${duration}ms`,
    // size: `${chalk.gray(sizeof(response.data) / 1000)} KB`,
    size: `${sizeof(response.data) / 1000} KB`
  };

  return metas;
};

export const getTimeAverage = (durations) => {
  return Math.round(durations.reduce((acc, cur) => acc + cur, 0) / durations.length);
};
