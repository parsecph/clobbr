export const formatNumber = (
  num: number,
  minDigits: number = 0,
  maxDigits: number = 2
) => {
  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(num);
};
