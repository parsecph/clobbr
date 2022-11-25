const stringToEmojiMap: { [key: string]: string } = {
  '&': '!',
  '+': '$',
  '/': '|',
  '?': "'",
  '%': '*'
  // $: '🐰',
  // ',': '✨',
  // ':': '🎩',
  // ';': '🦄',
  // '=': '💫',
  // '@': '🔥',
  // '#': '🧼',
  // ' ': '🚀',
  // '<': '👍',
  // '>': '👎',
  // '[': '👆',
  // ']': '👇',
  // '{': '🐴',
  // '}': '🦆',
  // '|': '🐭',
  // '\\': '🐲',
  // '^': '🍎',
};

const toEmojiMapRegexp = new RegExp(
  Object.keys(stringToEmojiMap)
    .map((c) => `\\${c}`)
    .join('|'),
  'gi'
);

const fromEmojiMapRegexp = new RegExp(
  Object.values(stringToEmojiMap)
    .map((c) => `\\${c}`)
    .join('|'),
  'gi'
);

export const toEmojiUriComponent = (url: string): string => {
  return url.replace(toEmojiMapRegexp, (matched: string) => {
    return stringToEmojiMap[matched] || matched;
  });
};

export const fromEmojiUriComponent = (url: string): string => {
  return url.replace(fromEmojiMapRegexp, (matched: string) => {
    return (
      Object.keys(stringToEmojiMap).find(
        (key) => stringToEmojiMap[key] === matched
      ) || matched
    );
  });
};
