import { Everbs } from 'shared/enums/http';
import { useEffect, useState } from 'react';

const swapUrlSsl = (url: string, ssl: boolean) =>
  ssl ? url.replace('http://', 'https://') : url.replace('https://', 'http://');

export const useSearchState = ({ initialState }: { [key: string]: any }) => {
  const [parallel, setParallel] = useState(initialState.search.parallel);
  const [ssl, setSsl] = useState(initialState.search.ssl);
  const [url, setUrl] = useState(initialState.search.url);
  const [iterations, setIterations] = useState(initialState.search.iterations);
  const [verb, setVerb] = useState<Everbs>(initialState.search.verb);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const checkUrlValidity = (url: string) =>
    url.includes('http://') || url.includes('https://');

  const toggleSsl = () => {
    const nextSslValue = !ssl;

    updateUrl(swapUrlSsl(url.displayText, nextSslValue), nextSslValue);
    setSsl(nextSslValue);
  };

  const updateUrl = (url: string, customSslValue: boolean = ssl) => {
    if (!url) {
      return setUrl({
        displayText: '',
        requestUrl: ''
      });
    }

    let requestUrl = url;

    if (url.includes('http://') || url.includes('https://')) {
      if (url.includes('https://')) {
        setSsl(true);
      } else {
        setSsl(false);
      }
    } else {
      requestUrl = customSslValue ? `https://${url}` : `http://${url}`;
    }

    setUrl({
      displayText: url,
      requestUrl
    });
  };

  const toggleParallel = () => {
    setParallel(!parallel);
  };

  const updateIterations = (iterations: number) => {
    setIterations(iterations);
  };

  const updateVerb = (verb: Everbs) => {
    setVerb(verb);
  };

  useEffect(() => {
    setIsUrlValid(checkUrlValidity(url.requestUrl));
  }, [url.requestUrl]);

  const searchState = {
    url,
    updateUrl,
    isUrlValid,

    ssl,
    toggleSsl,

    parallel,
    toggleParallel,

    iterations,
    updateIterations,

    verb,
    updateVerb
  };

  return {
    searchState
  };
};
