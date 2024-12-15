import { Everbs } from 'shared/enums/http';
import { ClobbrUIResult } from './ClobbrUIResult';
import { ClobbrUIProperties } from './ClobbrUIProperties';

export interface ClobbrUIListItem extends ClobbrUIResult {
  listItemId: string;
  properties?: ClobbrUIProperties;
  url: string;
  historicalResults: Array<ClobbrUIResult>;
  ssl: boolean;
  verb: Everbs;
}
