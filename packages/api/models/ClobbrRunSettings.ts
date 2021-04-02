import { EVERBS } from '../enums/http';

export interface ClobbrRunSettings {
  iterations: number;
  url: string;
  verb: EVERBS;
  headers: { [key: string]: string };
}
