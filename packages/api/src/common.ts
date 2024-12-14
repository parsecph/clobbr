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
import { sanitizeUrl } from './sanitize';

export const handleApiCall = async (
  index: number,
  {
    url,
    verb,
    headers,
    data,
    timeout,
    includeDataInResponse
  }: ClobbrRequestSettings
) => {
  // Don't send payload data if data object is empty
  const payloadData = data && Object.keys(data).length > 0 ? data : undefined;

  const sanitizedUrl = sanitizeUrl(url);
  const startTime = new Date().valueOf();
  const abortController = new AbortController();
  const res = await api.http({
    url: sanitizedUrl,
    method: verb,
    headers,
    data: payloadData,
    timeout: timeout || DEFAULT_HTTP_TIMEOUT_IN_MS,
    signal: abortController.signal
  });

  const endTime = new Date().valueOf();
  const duration = endTime - startTime;

  const isGql = data && !!(data.query || data.mutation);

  const { metas, errors } = isGql
    ? getGqlResponseMetas(res, duration, index, includeDataInResponse)
    : getResponseMetas(res, duration, index, includeDataInResponse);

  const logItem = {
    url: sanitizedUrl,
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
      : undefined,
    abortController
  };

  return { logItem, duration, abortController };
};

export const handleApiCallError = (
  { url, verb, headers }: ClobbrRequestSettings,
  error: AxiosError,
  index: number,
  runStartTime: number
) => {
  const sanitizedUrl = sanitizeUrl(url);
  const endTime = new Date().valueOf();
  const duration = endTime - runStartTime;

  const numberMeta = getNumberMeta(index);
  const logItem = {
    url: sanitizedUrl,
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
