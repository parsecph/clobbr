const COLOR_MAP = {
  0: 'green',
  1: 'yellow',
  2: 'orange',
  3: 'redBright'
};

export const getDurationColor = (duration) => {
  return COLOR_MAP[Math.round(duration / 1000)] || 'red';
};
