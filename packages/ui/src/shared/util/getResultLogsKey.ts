/**
 * Get the key for the result logs cache.
 */
export const getResultLogsKey = ({
  cachedId
}: {
  cachedId: string;
}): string => {
  return cachedId;
};
