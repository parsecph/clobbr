import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from './ClobbrUIHeaderItem';
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
  headers: Array<ClobbrUIHeaderItem>;
  headerInputMode: string;
  headerShellCmd: string;
  data: { [key: string]: any };
  timeout: number;
}
