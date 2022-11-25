export const formatNumber = (
  num: number,
  minDigits: number = 0,
  maxDigits: number = 2
) => {
  return new Intl.NumberFormat(['en'], {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(num);
};
