import axios, { AxiosInstance } from 'axios';
import { DEFAULT_HTTP_TIMEOUT_IN_MS } from './consts/http';
import packageJson from '../package.json';

const api = {
  http: axios,
  CancelToken: axios.CancelToken
} as {
  http: AxiosInstance;
  CancelToken: typeof axios.CancelToken;
};

api.http.defaults.timeout = DEFAULT_HTTP_TIMEOUT_IN_MS;
api.http.defaults.timeoutErrorMessage = 'Request timed out (10s)';
api.http.defaults.maxRedirects = 99;
api.http.defaults.headers['User-Agent'] = `clobbr/${packageJson.version}`;

export default api;
