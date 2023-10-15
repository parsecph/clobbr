import brotliPromise from 'brotli-wasm';

export const decompressBrotli = async (text?: string): Promise<string> => {
  if (!text) {
    return '';
  }

  const uintData = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
  const brotli = await brotliPromise;
  const textDecoder = new TextDecoder();

  const decompressedData = brotli.decompress(uintData);
  return textDecoder.decode(decompressedData);
};
