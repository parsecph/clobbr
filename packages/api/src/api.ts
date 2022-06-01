import { AxiosInstance } from 'axios';
import { DEFAULT_HTTP_TIMEOUT_IN_MS } from './consts/http';

const http = require('axios');

const api = {
  http
} as {
  http: AxiosInstance;
};

api.http.defaults.timeout = DEFAULT_HTTP_TIMEOUT_IN_MS;
api.http.defaults.timeoutErrorMessage = 'Request timed out (10s)';

export default api;
