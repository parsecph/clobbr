import { EEvents } from '../enums/events';

export interface ClobbrEventCallback {
  (type: EEvents, payload: { [key: string]: any }): void;
}
