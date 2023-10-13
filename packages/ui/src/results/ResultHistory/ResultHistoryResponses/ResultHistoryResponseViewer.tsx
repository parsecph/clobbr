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
import { isString } from 'lodash-es';
import { Button, Typography } from '@mui/material';

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
  log
}: {
  className?: string;
  log: ClobbrLogItem;
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
      // Failed items
      // Try to parse as JSON
      try {
        const string = JSON.stringify(log.error, null, 2);
        setFormattedResponse(string);
        setEditorLanguage('json');
        return;
      } catch (e) {
        console.warn('Could not parse error as JSON', e);
      }

      try {
        setEditorLanguage('plaintext');
        setFormattedResponse(log.error?.toString() || '');
        return;
      } catch (e) {
        console.warn('Could not parse error as plaintext', e);
      }
    } else {
      // Successful items
      if (!log.metas.data) {
        setFormattedResponse('');
        return;
      }

      if (isString(log.metas.data)) {
        // Try to parse as XML
        try {
          const xmlString = await formatXml(log.metas.data);

          if (xmlString) {
            setFormattedResponse(xmlString);
            setEditorLanguage('xml');
            return;
          }
        } catch (e) {
          console.warn('Could not parse as XML', e);
        }
      }

      // Try to parse as JSON
      try {
        const string = JSON.stringify(log.metas.data, null, 2);
        setFormattedResponse(string);
        setEditorLanguage('json');
        return;
      } catch (e) {
        console.warn('Could not parse as JSON', e);
      }
    }
  }, [
    log.error,
    log.failed,
    log.metas.data,
    setEditorLanguage,
    setFormattedResponse
  ]);

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
