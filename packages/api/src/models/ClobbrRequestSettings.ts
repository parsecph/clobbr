import { Everbs } from '../enums/http';

export interface ClobbrRequestSettings {
  iterations: number;
  url: string;
  verb: Everbs;
  headers: { [key: string]: string };
  data?: { [key: string]: any };
}
