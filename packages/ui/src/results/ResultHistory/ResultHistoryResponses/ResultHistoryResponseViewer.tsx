import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import MonacoEditor from '@uiw/react-monacoeditor';
import * as monaco from 'monaco-editor';
import { GlobalStore } from 'app/globalContext';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { useCopyToClipboard } from 'react-use';

import {
  LIGHT_THEME,
  LIGHT_THEME_SETTINGS,
  DARK_THEME,
  DARK_THEME_SETTINGS
} from 'shared/monaco/theme';

import { MONACO_OPTIONS } from 'shared/monaco/options';
import { Button } from '@mui/material';
import { decompressBrotli } from 'shared/util/compression';

declare type IMonacoEditor = typeof monaco;

/**
 * Given a markup string that is either html or xml, format it with indentation.
 *
 * @param markup the xml or html to format
 */
const formatXml = async (markup: string) => {
  const jsBeautify = await import('js-beautify');

  // Remove any newlines or spaces
  const formattedMarkup = markup.replace(/\n/g, '').replace(/\s\s+/g, ' ');
  return jsBeautify.default.html(formattedMarkup, {});
};

const onEditorMount = (
  _editor: monaco.editor.IStandaloneCodeEditor,
  monaco: IMonacoEditor
) => {
  monaco.editor.defineTheme(DARK_THEME, DARK_THEME_SETTINGS);
  monaco.editor.defineTheme(LIGHT_THEME, LIGHT_THEME_SETTINGS);
};

export const ResultHistoryResponseViewer = ({
  className,
  log,
  cacheId,
  logKey
}: {
  className?: string;
  log: ClobbrLogItem;
  cacheId: string;
  logKey?: string;
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const [formattedResponse, setFormattedResponse] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('');

  const showCopiedText = state.value && copied;

  const copyLogToClipboard = () => {
    let response;

    try {
      response = JSON.parse(formattedResponse);
    } catch (e) {
      response = formattedResponse;
    }

    copyToClipboard(
      JSON.stringify(
        {
          ...log,
          response
        },
        null,
        2
      )
    );
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const parseResponse = useCallback(async () => {
    if (!logKey) {
      setFormattedResponse('');
      return;
    }

    let cachedResponse;

    if (log.failed) {
      cachedResponse = await (window as any).electronAPI.getLogErrors(
        cacheId,
        log.metas.index
      );
    } else {
      cachedResponse = await (window as any).electronAPI.getLogData(
        cacheId,
        log.metas.index
      );
    }

    if (!cachedResponse) {
      const hint = log.failed
        ? 'Ensure you have error data collection enabled in settings'
        : 'Ensure you have response data collection enabled in settings';
      setFormattedResponse(` > No response data found. \n > ${hint}`);
      return;
    }

    // Decompress response data
    let decompressedResponse;

    try {
      decompressedResponse = await decompressBrotli(cachedResponse);
    } catch (e) {
      console.warn('Could not decompress response', e);
    }

    if (!decompressedResponse) {
      setFormattedResponse('');
      return;
    }

    // Try to parse as JSON
    try {
      const json = JSON.parse(decompressedResponse);
      const isLikelyAxiosError = json.code && json.status && json.message;

      // is this a string
      if (typeof json === 'string') {
        throw new Error('Response is a string');
      }

      if (json) {
        setFormattedResponse(
          isLikelyAxiosError
            ? JSON.stringify(
                {
                  message: json.message || '',
                  code: json.code || '',
                  status: json.status || '',
                  response: json.response || '',
                  config: {
                    url: json.config?.url || '',
                    method: json.config?.method || '',
                    headers: json.config?.headers || '',
                    data: json.config?.data || ''
                  }
                },
                null,
                2
              )
            : JSON.stringify(json, null, 2)
        );
        setEditorLanguage('json');
        return;
      }
    } catch (e) {
      console.warn('Could not parse as JSON', e);
    }

    // Try to parse as XML
    try {
      const xmlString = await formatXml(decompressedResponse);

      if (xmlString) {
        setFormattedResponse(xmlString);
        setEditorLanguage('xml');
        return;
      }
    } catch (e) {
      console.warn('Could not parse as XML', e);
    }
  }, [log.failed, log.metas.index, cacheId, logKey]);

  useEffect(() => {
    const formatResponse = async () => {
      setFormattedResponse('...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      await parseResponse();
    };

    formatResponse();
  }, [log, parseResponse]);

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <div className={clsx('w-full relative', className)}>
          {formattedResponse ? (
            <MonacoEditor
              className="rounded-tl-lg rounded-tr-lg overflow-hidden w-full"
              language={editorLanguage}
              value={formattedResponse}
              editorDidMount={onEditorMount}
              options={{
                ...MONACO_OPTIONS,
                automaticLayout: true,
                readOnly: true,
                theme: themeMode === 'dark' ? 'clobbr-dark' : 'clobbr-light'
              }}
            />
          ) : (
            <></>
          )}

          {formattedResponse ? (
            <Button
              onClick={copyLogToClipboard}
              size="small"
              color="primary"
              className="!absolute top-2 right-4 z-10 !text-xs !px-2 !py-1 !min-w-0"
            >
              {!state.error && !showCopiedText ? 'Copy' : ''}
              {state.error ? (
                <span className="uppercase text-red-500">Error</span>
              ) : (
                ''
              )}
              {showCopiedText ? <span>Copied</span> : ''}
            </Button>
          ) : (
            <></>
          )}
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
