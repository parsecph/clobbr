import { Everbs } from 'shared/enums/http';
import { ClobbrUIResult } from './ClobbrUIResult';

export interface ClobbrUIResultListItem {
  id: string;
  url: string;
  latestResult: ClobbrUIResult;
  parallel: boolean;
  verb: Everbs;
  iterations: number;
  historicalResults: Array<ClobbrUIResult>;
  ssl: boolean;
}
