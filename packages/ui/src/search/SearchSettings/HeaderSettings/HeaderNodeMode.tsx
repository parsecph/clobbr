import { useContext, useState } from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import * as monaco from 'monaco-editor';

import { GlobalStore } from 'App/globalContext';

import { Button, Alert } from '@mui/material';

import {
  LIGHT_THEME,
  LIGHT_THEME_SETTINGS,
  DARK_THEME,
  DARK_THEME_SETTINGS
} from 'shared/monaco/theme';

import { MONACO_OPTIONS } from 'shared/monaco/options';

declare type IMonacoEditor = typeof monaco;

const onEditorMount = (
  _editor: monaco.editor.IStandaloneCodeEditor,
  monaco: IMonacoEditor
) => {
  monaco.editor.defineTheme(DARK_THEME, DARK_THEME_SETTINGS);
  monaco.editor.defineTheme(LIGHT_THEME, LIGHT_THEME_SETTINGS);
};

export const HeaderNodeMode = () => {
  const globalStore = useContext(GlobalStore);
  const [initialTextValue] = useState<string>(
    globalStore.search.headerNodeScriptData.text
  );
  const [lastNodeOutput, setLastNodeOutput] = useState('');

  const onEditorChange = (newValue: string) => {
    globalStore.search.updateHeaderNodeScriptData(newValue);
  };

  const testNodeCmd = async (cmd: string) => {
    const electronAPI = (window as any).electronAPI;

    if (electronAPI) {
      const { result } = await electronAPI.runNodeCmd(cmd);
      setLastNodeOutput(result);
    }
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode, search }) => (
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col gap-6 mt-6 h-full flex-grow flex-shrink ">
              <MonacoEditor
                className="rounded-tl-lg rounded-tr-lg overflow-hidden"
                language="javascript"
                value={initialTextValue}
                onChange={onEditorChange}
                editorDidMount={onEditorMount}
                options={{
                  ...MONACO_OPTIONS,
                  theme: themeMode === 'dark' ? 'clobbr-dark' : 'clobbr-light'
                }}
              />
            </div>

            <Button
              onClick={() => testNodeCmd(search.headerNodeScriptData.text)}
              color="secondary"
            >
              Test script
            </Button>
          </div>

          {lastNodeOutput ? (
            <pre className="bg-white dark:bg-black text-black dark:text-white rounded-md p-4 overflow-auto">
              <small>{lastNodeOutput}</small>
            </pre>
          ) : (
            <></>
          )}

          <Alert severity="info">
            This Node.js script will be executed before a run. Its output will
            be used as headers.
            <br />
            The command return value should be in JSON format, i.e. one could
            use a fetch auth credentials before sending the request:
            <pre>
              <small>
                return fetch('example.com').then(response =&gt;
                response.json()).then(data =&gt; data);
              </small>
              <br />
              <small>&gt; &#123; "Authorization": "Bearer ..." &#125;</small>
            </pre>
          </Alert>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
