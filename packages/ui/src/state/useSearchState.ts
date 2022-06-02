import { useEffect, useState } from 'react';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';

const swapUrlSsl = (url: string, ssl: boolean) =>
  ssl ? url.replace('http://', 'https://') : url.replace('https://', 'http://');

export const useSearchState = ({ initialState }: { [key: string]: any }) => {
  const [parallel, setParallel] = useState(initialState.search.parallel);
  const [ssl, setSsl] = useState(initialState.search.ssl);
  const [url, setUrl] = useState(initialState.search.url);
  const [iterations, setIterations] = useState(initialState.search.iterations);
  const [verb, setVerb] = useState<Everbs>(initialState.search.verb);
  const [headerItems, setHeaderItems] = useState<Array<ClobbrUIHeaderItem>>(
    initialState.search.headerItems
  );
  const [requestTimeout, setRequestTimeout] = useState(
    initialState.search.timeout
  );
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

  const addHeaderItem = (header: ClobbrUIHeaderItem) => {
    setHeaderItems([...headerItems, header]);
  };

  const updateHeaderItem = (header: ClobbrUIHeaderItem) => {
    const headerItem = headerItems.find((i) => i.id === header.id);

    if (!headerItem) {
      console.warn(`Could not find header item with id ${header.id}`);
      return false;
    }

    const index = headerItems.findIndex((i) => i.id === header.id);

    setHeaderItems([
      ...headerItems.slice(0, index),
      header,
      ...headerItems.slice(index + 1)
    ]);
  };

  const removeHeaderItem = (headerItemId: string) => {
    setHeaderItems(headerItems.filter((item) => item.id !== headerItemId));
  };

  const updateTimeout = (timeout: number) => {
    setRequestTimeout(timeout);
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
    updateVerb,

    headerItems,
    addHeaderItem,
    updateHeaderItem,
    removeHeaderItem,

    timeout: requestTimeout,
    updateTimeout
  };

  return {
    searchState
  };
};
