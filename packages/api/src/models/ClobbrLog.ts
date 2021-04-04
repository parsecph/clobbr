import { AxiosError } from 'axios';
import { Everbs } from 'enums/http';

export interface ClobbrLogItem {
  url: string;
  verb: Everbs;
  headers: { [key: string]: string };
  metas: ClobbrLogItemMeta;
  formatted: string;
  failed?: boolean;
  error?: AxiosError;
}

export interface ClobbrLogItemMeta {
  index: number;
  number?: string;
  status?: string;
  statusCode?: number;
  duration?: string;
  size?: string;
  data?: { [key: string]: string };
}

export interface ClobbrLogItemFailedMessage {
  formatted: string;
  status?: string;
  statusText?: string;
}
