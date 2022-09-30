export interface ClobbrUIProperties {
  gql?: {
    isGql: boolean;
    gqlVariables: { [key: string]: any };
    gqlName: string;
  };
}
