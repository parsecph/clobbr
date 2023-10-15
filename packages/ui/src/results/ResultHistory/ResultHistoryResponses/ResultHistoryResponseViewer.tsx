import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import MonacoEditor from '@uiw/react-monacoeditor';
import * as monaco from 'monaco-editor';
import { GlobalStore } from 'app/globalContext';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { ClobbrUICachedLog } from 'models/ClobbrUICachedLog';
import { useCopyToClipboard } from 'react-use';

import {
  LIGHT_THEME,
  LIGHT_THEME_SETTINGS,
  DARK_THEME,
  DARK_THEME_SETTINGS
} from 'shared/monaco/theme';

import { MONACO_OPTIONS } from 'shared/monaco/options';
import { Button } from '@mui/material';
import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';
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
  logKey
}: {
  className?: string;
  log: ClobbrLogItem;
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
    /* Successful items */
    if (!logKey) {
      setFormattedResponse('');
      return;
    }

    // Get response data from DB.
    const resultDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);
    const cachedResponse = (await resultDb.getItem(
      `${SK.RESULT_RESPONSE.ITEM}-${logKey}`
    )) as ClobbrUICachedLog | null;

    if (!cachedResponse) {
      setFormattedResponse('');
      return;
    }

    // Decompress response data
    let decompressedResponse;

    try {
      decompressedResponse = await decompressBrotli(
        log.failed ? cachedResponse.error : cachedResponse.data
      );
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

      if (json) {
        setFormattedResponse(JSON.stringify(json, null, 2));
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
  }, [log.failed, logKey]);

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
