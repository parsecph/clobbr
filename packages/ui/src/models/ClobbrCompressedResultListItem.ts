export interface ClobbrUICompressedResultListItem {
  szM: { [key: string]: number };
  stM: { [key: string]: number };
  scM: { [key: string]: number };
  u: string;
  v: string;
  s: boolean;
  ig?: boolean;
  gql?: string;
  lr: {
    i: number;
    l: Array<Array<number | string>>;
    p: boolean;
    s?: string;
    e?: string;
  };
}
