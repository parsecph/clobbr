import { AxiosError } from 'axios';
import { DEFAULT_HTTP_TIMEOUT_IN_MS } from './consts/http';
import api from './api';
import { ClobbrRequestSettings } from './models/ClobbrRequestSettings';
import { ClobbrExtendedAxiosError } from './models/ClobbrLog';
import {
  getFailedMessage,
  getGqlResponseMetas,
  getNumberMeta,
  getResponseMetas
} from './util';

export const handleApiCall = async (
  index: number,
  { url, verb, headers, data, timeout }: ClobbrRequestSettings
) => {
  const startTime = new Date().valueOf();
  const res = await api.http({
    url,
    method: verb,
    headers,
    data,
    timeout: timeout || DEFAULT_HTTP_TIMEOUT_IN_MS
  });

  const endTime = new Date().valueOf();
  const duration = endTime - startTime;

  const isGql = data && !!(data.query || data.mutation);

  const { metas, errors } = isGql
    ? getGqlResponseMetas(res, duration, index)
    : getResponseMetas(res, duration, index);

  const logItem = {
    url,
    verb,
    headers,
    formatted: `${metas.number}: ${metas.duration} ${metas.durationUnit} ${metas.status} ${metas.size}`,
    metas,
    failed: !metas.statusOk,
    error: errors
      ? ({
          message: 'GQL inner error',
          name: 'GQL error',
          gqlErrors: errors
        } as ClobbrExtendedAxiosError)
      : undefined
  };

  return { logItem, duration };
};

export const handleApiCallError = (
  { url, verb, headers }: ClobbrRequestSettings,
  error: AxiosError,
  index: number,
  runStartTime: number
) => {
  const endTime = new Date().valueOf();
  const duration = endTime - runStartTime;

  const numberMeta = getNumberMeta(index);
  const logItem = {
    url,
    verb,
    headers,
    metas: {
      number: numberMeta,
      ...getFailedMessage(index, error),
      index,
      duration
    },
    formatted: `${numberMeta}: Failed`,
    failed: true,
    error
  };

  return { logItem };
};
