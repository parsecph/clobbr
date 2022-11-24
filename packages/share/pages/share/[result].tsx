import { useRouter } from 'next/router';

import brotliPromise from 'brotli-wasm';
import { useEffect } from 'react';
import { fromEmojiUriComponent } from '@clobbr/ui/src/shared/util/emojiUriComponent';

const decode = async (compressedData: Uint8Array) => {
  const brotli = await brotliPromise;
  const textDecoder = new TextDecoder();

  const decompressedData = brotli.decompress(compressedData);
  return textDecoder.decode(decompressedData);
};

const Result = () => {
  const router = useRouter();
  const { result } = router.query;

  useEffect(() => {
    const decompress = async () => {
      if (!result) {
        return;
      }

      const resultStr = fromEmojiUriComponent(result as string);

      const decoded = await decode(
        Uint8Array.from(atob(resultStr), (c) => c.charCodeAt(0))
      );

      console.log(decoded);
    };

    decompress();
  }, [result]);

  return (
    <div>
      <h1>Result</h1>

      {result}
    </div>
  );
};

export default Result;
