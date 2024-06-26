const COLOR_MAP = {
  0: 'green',
  1: 'yellow',
  2: 'orange',
  3: 'redBright'
};

export const getDurationColor = (duration) => {
  if (duration < 0) {
    return 'white';
  }

  if (duration > 3000) {
    return 'red';
  }

  return COLOR_MAP[Math.round(duration / 1000)];
};

export const formatNumber = (
  num: number,
  minDigits: number = 0,
  maxDigits: number = 2
) => {
  try {
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits
    }).format(num);
  } catch (error) {
    return num;
  }
};
