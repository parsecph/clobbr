import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export interface ClobbrUIResult {
  id: string;
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
}
