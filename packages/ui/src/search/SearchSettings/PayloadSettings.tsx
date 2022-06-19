import { useContext, useState } from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import * as monaco from 'monaco-editor';

import { GlobalStore } from 'App/globalContext';

import { Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

import {
  LIGHT_THEME,
  LIGHT_THEME_SETTINGS,
  DARK_THEME,
  DARK_THEME_SETTINGS
} from 'shared/monaco/theme';

import { MONACO_OPTIONS } from 'shared/monaco/options';

declare type IMonacoEditor = typeof monaco;

export const PAYLOAD_MODES = {
  JSON: 'JSON'
};

const onEditorMount = (
  _editor: monaco.editor.IStandaloneCodeEditor,
  monaco: IMonacoEditor
) => {
  monaco.editor.defineTheme(DARK_THEME, DARK_THEME_SETTINGS);
  monaco.editor.defineTheme(LIGHT_THEME, LIGHT_THEME_SETTINGS);
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
          <Typography
            variant="overline"
            className="opacity-50 flex gap-2 justify-between"
          >
            {/* Set request payload (data), either static, through faker or a script */}
            Set request payload (data)
            <ToggleButtonGroup
              color={themeMode === 'dark' ? 'primary' : 'secondary'}
              value={PAYLOAD_MODES.JSON}
              exclusive
              size="small"
            >
              <ToggleButton
                disabled={true}
                value={PAYLOAD_MODES.JSON}
                sx={{ textTransform: 'none', padding: '0.25rem 1rem' }}
              >
                JSON
              </ToggleButton>
            </ToggleButtonGroup>
          </Typography>

          <div className="flex flex-col gap-6 mt-6 h-full flex-grow flex-shrink ">
            <MonacoEditor
              className="rounded-lg overflow-hidden"
              language="json"
              value={initialTextValue}
              onChange={onEditorChange}
              editorDidMount={onEditorMount}
              options={{
                ...MONACO_OPTIONS,
                theme: themeMode === 'dark' ? 'clobbr-dark' : 'clobbr-light'
              }}
            />
          </div>
        </div>
      )}
    </GlobalStore.Consumer>
  );
};
