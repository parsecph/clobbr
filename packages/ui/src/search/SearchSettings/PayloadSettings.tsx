import { useContext, useState } from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import * as monaco from 'monaco-editor';

import { GlobalStore } from 'App/globalContext';

import { Typography } from '@mui/material';

declare type IMonacoEditor = typeof monaco;

const onEditorMount = (
  _editor: monaco.editor.IStandaloneCodeEditor,
  monaco: IMonacoEditor
) => {
  monaco.editor.defineTheme('clobbr-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [{ background: 'EDF9FA', token: '' }],
    colors: {
      'editor.background': '#28292a',
      'minimap.background': '#111827b3'
    }
  });

  monaco.editor.defineTheme('clobbr-light', {
    base: 'vs',
    inherit: true,
    rules: [{ background: 'EDF9FA', token: '' }],
    colors: {
      'editor.background': '#ffffff',
      'minimap.background': '#f3f4f64d'
    }
  });
};

export const PayloadSettings = () => {
  const globalStore = useContext(GlobalStore);
  const [initialTextValue] = useState<string>(globalStore.search.data.text);

  const onEditorChange = (newValue: string) => {
    globalStore.search.updateData(newValue);
  };

  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <div className="flex flex-col flex-grow">
          <Typography variant="overline" className={'opacity-50'}>
            {/* Set request payload (data), either static, through faker or a script */}
            Set request payload (data)
          </Typography>

          <div className="flex flex-col gap-6 mt-6 h-full flex-grow flex-shrink ">
            <MonacoEditor
              className="rounded-lg overflow-hidden"
              language="json"
              value={initialTextValue}
              onChange={onEditorChange}
              editorDidMount={onEditorMount}
              options={{
                padding: {
                  bottom: 20,
                  top: 20
                },
                minimap: {
                  enabled: false
                },
                tabSize: 2,
                selectOnLineNumbers: true,
                lineNumbers: 'off',
                roundedSelection: true,
                scrollBeyondLastLine: true,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: true,
                theme: themeMode === 'dark' ? 'clobbr-dark' : 'clobbr-light',
                scrollbar: {
                  verticalScrollbarSize: 5,
                  horizontalScrollbarSize: 5
                }
              }}
            />
          </div>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
