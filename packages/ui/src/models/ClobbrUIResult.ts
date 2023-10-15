import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export const UI_RESULT_STATES = {
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED'
};

export type ClobbrUIResultState =
  typeof UI_RESULT_STATES[keyof typeof UI_RESULT_STATES];

export interface ClobbrUIResult {
  cacheId: string;
  startDate?: string;
  endDate?: string;
  resultDurations: Array<number>;
  logs: Array<ClobbrLogItem>;

  // Config
  parallel: boolean;
  iterations: number;
  headers?: Array<ClobbrUIHeaderItem>;
  headerInputMode?: string;
  headerShellCmd?: string;
  headerNodeScriptData?: {
    text?: string;
    valid: boolean;
  };
  data?: { [key: string]: any };
  timeout: number;
  state?: ClobbrUIResultState;
}
