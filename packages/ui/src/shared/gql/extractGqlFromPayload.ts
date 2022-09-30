export const extractGqlDataFromPayload = (payload: { [key: string]: any }) => {
  if (!payload) {
    return {
      isGql: false,
      gqlVariables: null,
      gqlName: ''
    };
  }

  return {
    isGql: !!(payload.query || payload.mutation),
    gqlVariables: payload.variables,
    gqlName: payload.operationName
  };
};
