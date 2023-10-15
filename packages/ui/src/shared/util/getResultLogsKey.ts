/**
 * Get the key for the result logs cache.
 */
export const getResultLogsKey = ({
  cacheId,
  index
}: {
  cacheId: string;
  index: number;
}): string => {
  return `${cacheId}-${index}`;
};
