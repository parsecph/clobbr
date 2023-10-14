import { AxiosError } from 'axios';
import { Everbs } from '../enums/http';

export interface ClobbrExtendedAxiosError extends AxiosError {
  gqlErrors?: Array<any>;
}

export interface ClobbrLogItem {
  url: string;
  verb: Everbs;
  headers: { [key: string]: string };
  metas: ClobbrLogItemMeta;
  formatted: string;
  failed?: boolean;
  error?: AxiosError | string;
}

export interface ClobbrLogItemMeta {
  index: number;
  number?: string;
  status?: string;
  statusCode?: number;
  statusOk?: boolean;
  duration?: number;
  durationUnit?: string;
  size?: string;
  data?: { [key: string]: string } | string;
}

export interface ClobbrLogItemFailedMessage {
  formatted: string;
  status?: string;
  statusText?: string;
  statusCode?: number;
}
