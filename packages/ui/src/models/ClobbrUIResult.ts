import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';

export interface ClobbrUIResult {
  id: string;
  startDate?: string;
  endDate?: string;
  resultDurations: Array<number>;
  logs: Array<ClobbrLogItem>;
  averageDuration: number;
}
