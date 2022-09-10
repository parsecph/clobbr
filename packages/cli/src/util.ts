const COLOR_MAP = {
  0: 'green',
  1: 'yellow',
  2: 'orange',
  3: 'redBright'
};

export const getDurationColor = (duration) => {
  return COLOR_MAP[Math.round(duration / 1000)] || 'red';
};

export const formatNumber = (
  num: number,
  minDigits: number = 0,
  maxDigits: number = 2
) => {
  return new Intl.NumberFormat('en', {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(num);
};
