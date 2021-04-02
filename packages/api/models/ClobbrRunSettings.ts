import { Everbs } from '../enums/http';

export interface ClobbrRunSettings {
  iterations: number;
  url: string;
  verb: Everbs;
  headers: { [key: string]: string };
}
