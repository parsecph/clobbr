const asc = (arr: Array<number>) => arr.sort((a, b) => a - b);
const sum = (arr: Array<number>) => arr.reduce((a, b) => a + b, 0);

const quantile = (arr: Array<number>, q: number) => {
  if (!arr.length) {
    return 0;
  }

  const sorted = asc(arr);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

export const mean = (arr: Array<number>) =>
  arr.length ? sum(arr) / arr.length : 0;
export const median = (arr: Array<number>) => q50(arr);

export const stdDev = (arr: Array<number>) => {
  if (!arr.length) {
    return 0;
  }

  const meanValue = mean(arr);
  const diffArr = arr.map((item) => (item - meanValue) ** 2);
  return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

export const q5 = (arr: Array<number>) => quantile(arr, 0.5);
export const q50 = (arr: Array<number>) => quantile(arr, 0.5);
export const q95 = (arr: Array<number>) => quantile(arr, 0.95);
export const q99 = (arr: Array<number>) => quantile(arr, 0.99);
