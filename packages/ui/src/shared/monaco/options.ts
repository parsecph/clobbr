import * as monaco from 'monaco-editor';

export const MONACO_OPTIONS = {
  padding: {
    bottom: 20,
    top: 20
  },
  minimap: {
    enabled: false
  },
  links: false,
  tabSize: 2,
  selectOnLineNumbers: true,
  lineNumbers: 'off',
  roundedSelection: true,
  scrollBeyondLastLine: true,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: true,
  scrollbar: {
    verticalScrollbarSize: 5,
    horizontalScrollbarSize: 5
  }
} as monaco.editor.IStandaloneEditorConstructionOptions;
