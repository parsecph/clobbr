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
import { isString } from 'lodash-es';
import { Button } from '@mui/material';
import { getDb } from 'storage/storage';
import { EDbStores } from 'storage/EDbStores';
import { SK } from 'storage/storageKeys';

declare type IMonacoEditor = typeof monaco;

/**
 * Given a markup string that is either html or xml, format it with indentation.
 *
 * @param markup the xml or html to format
 */
const formatXml = async (markup: string) => {
  const jsBeautify = await import('js-beautify');

  return jsBeautify.default.html(markup, {});
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
  logKey: string;
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const [formattedResponse, setFormattedResponse] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('');

  const showCopiedText = state.value && copied;

  const copyLogToClipboard = () => {
    copyToClipboard(JSON.stringify(log, null, 2));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const parseResponse = useCallback(async () => {
    if (log.failed) {
      /* Failed items */
      try {
        // Try to parse as JSON
        const string = JSON.stringify(
          {
            ...log.metas,
            error: log.error
          },
          null,
          2
        );
        setFormattedResponse(string);
        setEditorLanguage('json');
        return;
      } catch (e) {
        console.warn('Could not parse error as JSON', e);
      }

      try {
        // Try to parse as plaintext
        setEditorLanguage('json');
        setFormattedResponse(
          JSON.stringify(
            {
              ...log.metas,
              error: log.error?.toString()
            },
            null,
            2
          )
        );
        return;
      } catch (e) {
        console.warn('Could not parse error as plaintext', e);
      }
    } else {
      /* Successful items */
      const resultDb = getDb(EDbStores.RESULT_LOGS_STORE_NAME);
      const data = await resultDb.getItem(
        `${SK.RESULT_RESPONSE.ITEM}-${logKey}`
      );

      // Get response data from DB.
      if (!data) {
        setFormattedResponse('');
        return;
      }

      const cachedResponse = data.find(
        (item: ClobbrUICachedLog) => item.index === log.metas.index
      );

      if (!cachedResponse) {
        setFormattedResponse('');
        return;
      }

      if (isString(cachedResponse.data)) {
        try {
          // Try to parse as XML
          const xmlString = await formatXml(cachedResponse.data);

          if (xmlString) {
            setFormattedResponse(xmlString);
            setEditorLanguage('xml');
            return;
          }
        } catch (e) {
          console.warn('Could not parse as XML', e);
        }
      }

      try {
        // Try to parse as JSON
        const string = JSON.stringify(cachedResponse.data, null, 2);
        setFormattedResponse(string);
        setEditorLanguage('json');
        return;
      } catch (e) {
        console.warn('Could not parse as JSON', e);
      }
    }
  }, [log.error, log.failed, log.metas, logKey]);

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
