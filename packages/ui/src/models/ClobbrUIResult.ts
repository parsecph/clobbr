import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export const UI_RESULT_STATES = {
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED'
};

export type ClobbrUIResultState =
  (typeof UI_RESULT_STATES)[keyof typeof UI_RESULT_STATES];

export interface ClobbrUIResult {
  cacheId: string;
  data?: { [key: string]: any };
  endDate?: string;
  endTimestamp?: number;
  headerInputMode?: string;
  headerNodeScriptData?: {
    text?: string;
    valid: boolean;
  };
  headerShellCmd?: string;
  headers?: Array<ClobbrUIHeaderItem>;
  iterations: number;
  logs: Array<ClobbrLogItem>;
  parallel: boolean;
  resultDurations: Array<number>;
  startDate?: string;
  startTimestamp?: number;
  state?: ClobbrUIResultState;
  timeout: number;
}
