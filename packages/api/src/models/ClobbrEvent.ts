import { EEvents } from '../enums/events';
import { ClobbrLogItem } from './ClobbrLog';

export interface ClobbrEventCallback {
  (type: EEvents, log: ClobbrLogItem, logs: Array<ClobbrLogItem>): any;
}
