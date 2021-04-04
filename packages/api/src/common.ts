import api from './api';
import { ClobbrRunSettings } from './models/ClobbrRunSettings';
import { getFailedMessage, getNumberMeta, getResponseMetas } from './util';
import { AxiosError } from 'axios';

export const handleApiCall = async (
  index: number,
  { url, verb, headers }: ClobbrRunSettings
) => {
  const startTime = new Date().valueOf();
  const res = await api.http[verb](url, { headers });
  const endTime = new Date().valueOf();
  const duration = endTime - startTime;
  const metas = getResponseMetas(res, duration, index);
  const logItem = {
    url,
    verb,
    headers,
    formatted: `${metas.number}: ${metas.duration} ${metas.status} ${metas.size}`,
    metas
  };

  return { logItem, duration };
};

export const handleApiCallError = (
  { url, verb, headers }: ClobbrRunSettings,
  error: AxiosError,
  index: number
) => {
  const numberMeta = getNumberMeta(index);
  const logItem = {
    url,
    verb,
    headers,
    metas: {
      number: numberMeta,
      ...getFailedMessage(index, error),
      index
    },
    formatted: `${numberMeta}: Failed`,
    failed: true,
    error
  };

  return { logItem };
};
