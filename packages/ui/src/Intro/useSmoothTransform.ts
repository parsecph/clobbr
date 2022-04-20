import { useSpring, useTransform } from 'framer-motion';

export function useSmoothTransform(
  value: any,
  springOptions: any,
  transformer: any
) {
  return useSpring(useTransform(value, transformer), springOptions);
}
