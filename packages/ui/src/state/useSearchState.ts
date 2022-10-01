import { useEffect, useState } from 'react';
import { Everbs } from 'shared/enums/http';
import { ClobbrUIHeaderItem } from 'models/ClobbrUIHeaderItem';
import { ClobbrUIResultListItem } from 'models/ClobbrUIResultListItem';
import {
  ESearchSettingsMode,
  SEARCH_SETTINGS_MODE
} from 'shared/enums/ESearchSettingsMode';
import { extractGqlDataFromPayload } from 'shared/gql/extractGqlFromPayload';

const swapUrlSsl = (url: string, ssl: boolean) =>
  ssl ? url.replace('http://', 'https://') : url.replace('https://', 'http://');

export const useSearchState = ({ initialState }: { [key: string]: any }) => {
  const [plannedIterations, setPlannedIterations] = useState(0);
  const [wsReady, setWsReady] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsMode, setSettingsMode] = useState(SEARCH_SETTINGS_MODE.INPUT);
  const [parallel, setParallel] = useState(initialState.search.parallel);
  const [ssl, setSsl] = useState(initialState.search.ssl);
  const [url, setUrl] = useState(initialState.search.url);
  const [iterations, setIterations] = useState(initialState.search.iterations);
  const [verb, setVerb] = useState<Everbs>(initialState.search.verb);
  const [payloadData, setPayloadData] = useState(initialState.search.data);
  const [properties, setProperties] = useState(initialState.search.properties);
  const [headerInputMode, setHeaderInputMode] = useState(
    initialState.search.headerInputMode
  );
  const [headerItems, setHeaderItems] = useState<Array<ClobbrUIHeaderItem>>(
    initialState.search.headerItems
  );
  const [headerShellCmd, setHeaderShellCmd] = useState(
    initialState.search.headerShellCmd
  );
  const [headerNodeScriptData, setHeaderNodeScriptData] = useState(
    initialState.search.headerNodeScriptData
  );
  const [requestTimeout, setRequestTimeout] = useState(
    initialState.search.timeout
  );
  const [isUrlValid, setIsUrlValid] = useState(false);

  const checkUrlValidity = (url: string) =>
    url.includes('http://') || url.includes('https://');

  const showSettingsModal = (settingsMode: ESearchSettingsMode) => {
    if (settingsMode) {
      setSettingsMode(settingsMode);
    } else {
      setSettingsMode(SEARCH_SETTINGS_MODE.INPUT);
    }
    setSettingsModalOpen(true);
  };
  const hideSettingsModal = () => {
    setSettingsModalOpen(false);
    setSettingsMode(SEARCH_SETTINGS_MODE.INPUT);
  };

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

  const updateHeaderInputMode = (headerInputMode: string) => {
    if (headerInputMode) {
      setHeaderInputMode(headerInputMode);
    }
  };

  const updateHeaderShellCmd = (shellCmd: string) => {
    setHeaderShellCmd(shellCmd);
  };

  const removeHeaderItem = (headerItemId: string) => {
    setHeaderItems(headerItems.filter((item) => item.id !== headerItemId));
  };

  const updateTimeout = (timeout: number) => {
    setRequestTimeout(timeout);
  };

  const updateData = (jsonString: string) => {
    try {
      const parsedJson = JSON.parse(jsonString);

      if (parsedJson) {
        setPayloadData({
          json: parsedJson,
          text: jsonString,
          valid: true
        });

        const { isGql, gqlVariables, gqlName } =
          extractGqlDataFromPayload(parsedJson);
        setProperties({
          ...properties,
          gql: {
            isGql,
            gqlVariables,
            gqlName
          }
        });
      }
    } catch (error) {
      console.warn('Bailed saving payload, JSON invalid');

      setPayloadData({
        json: null,
        text: jsonString,
        valid: false
      });

      setProperties({
        ...properties,
        gql: null
      });
    }
  };

  const updateHeaderNodeScriptData = (scriptString: string) => {
    try {
      // TODO validate?
      const valid = true;

      if (valid) {
        setHeaderNodeScriptData({
          text: scriptString,
          valid: true
        });
      }
    } catch (error) {
      console.warn('Bailed saving node script, invalid js');

      setHeaderNodeScriptData({
        text: scriptString,
        valid: false
      });
    }
  };

  const setSettings = (item: ClobbrUIResultListItem) => {
    const payloadData = item.data
      ? {
          json: item.data,
          text: JSON.stringify(item.data, null, 2),
          valid: true // TODO validate again?
        }
      : null;

    setUrl({
      displayText: item.url.replace(/^https?:\/\//, ''),
      requestUrl: item.url
    });
    setParallel(item.parallel);
    setSsl(item.ssl);
    setIterations(item.iterations);
    setVerb(item.verb);
    setPayloadData(payloadData);
    setProperties(item.properties);
    setHeaderInputMode(item.headerInputMode);
    setHeaderItems(item.headers);
    setHeaderShellCmd(item.headerShellCmd);
    setHeaderNodeScriptData(item.headerNodeScriptData);
    setRequestTimeout(item.timeout);
  };

  const resetSettingsToDefault = () => {
    setParallel(initialState.search.parallel);
    setSsl(initialState.search.ssl);
    setPayloadData(initialState.search.data);
    setProperties(initialState.search.properties);
    setHeaderInputMode(initialState.search.headerInputMode);
    setHeaderItems(initialState.search.headerItems);
    setHeaderShellCmd(initialState.search.headerShellCmd);
    setHeaderNodeScriptData(initialState.search.headerNodeScriptData);
    setRequestTimeout(initialState.search.timeout);
  };

  useEffect(() => {
    setIsUrlValid(checkUrlValidity(url.requestUrl));
  }, [url.requestUrl]);

  const searchState = {
    plannedIterations,
    setPlannedIterations,

    wsReady,
    setWsReady,

    inProgress: searchInProgress,
    setInProgress: setSearchInProgress,

    settingsModalOpen,
    hideSettingsModal,
    showSettingsModal,
    settingsMode,

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

    data: payloadData,
    updateData,

    properties,
    updateProperties: setProperties,

    headerInputMode,
    updateHeaderInputMode,
    headerShellCmd,
    updateHeaderShellCmd,
    headerNodeScriptData,
    updateHeaderNodeScriptData,
    headerItems,
    addHeaderItem,
    updateHeaderItem,
    removeHeaderItem,

    timeout: requestTimeout,
    updateTimeout,

    setSettings,
    resetSettingsToDefault
  };

  return {
    searchState
  };
};
