import brotliPromise from 'brotli-wasm';

export const decodeShareData = async (compressedData: string) => {
  const uintData = Uint8Array.from(atob(compressedData), (c) =>
    c.charCodeAt(0)
  );
  const brotli = await brotliPromise;
  const textDecoder = new TextDecoder();

  const decompressedData = brotli.decompress(uintData);
  return textDecoder.decode(decompressedData);
};
