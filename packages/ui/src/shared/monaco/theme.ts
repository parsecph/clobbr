import * as monaco from 'monaco-editor';
import { colors } from 'shared/colors';

export const LIGHT_THEME = 'clobbr-light';

export const LIGHT_THEME_SETTINGS = {
  base: 'vs' as monaco.editor.BuiltinTheme,
  inherit: true,
  rules: [
    { background: 'EDF9FA', token: '' },
    { token: 'string.value.json', foreground: colors.primary.dark },
    { token: 'string.js', foreground: colors.primary.dark }
  ],
  colors: {
    'editor.background': '#ffffff',
    'minimap.background': '#f3f4f64d'
  }
};

export const DARK_THEME = 'clobbr-dark';

export const DARK_THEME_SETTINGS = {
  base: 'vs-dark' as monaco.editor.BuiltinTheme,
  inherit: true,
  rules: [
    { background: 'EDF9FA', token: '' },
    { token: 'string.value.json', foreground: colors.primary.dark },
    { token: 'string.js', foreground: colors.primary.dark }
  ],
  colors: {
    'editor.background': '#28292a',
    'minimap.background': '#111827b3'
  }
};
