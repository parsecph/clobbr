/**
 * Get the key for the result logs cache.
 */
export const getResultLogsKey = ({
  cachedId,
  index
}: {
  cachedId: string;
  index: number;
}): string => {
  return `${cachedId}-${index}`;
};
