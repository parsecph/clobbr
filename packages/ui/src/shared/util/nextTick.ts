export const nextTick = (callback: () => void) => {
  setTimeout(callback, 0);
};
