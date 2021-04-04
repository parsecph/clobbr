import api from './api';
import { ClobbrRequestSettings } from './models/ClobbrRequestSettings';
import { getFailedMessage, getNumberMeta, getResponseMetas } from './util';
import { AxiosError } from 'axios';

export const handleApiCall = async (
  index: number,
  { url, verb, headers, data }: ClobbrRequestSettings
) => {
  const startTime = new Date().valueOf();
  const res = await api.http({
    url,
    method: verb,
    headers,
    data
  });

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
  { url, verb, headers }: ClobbrRequestSettings,
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
