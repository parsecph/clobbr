import type { AppProps } from 'next/app';
import clsx from 'clsx';
import { Inter } from '@next/font/google';
import { colors } from '@/theme/colors';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme/theme';
import Head from 'next/head';
import AppHead from '@/components/layout/head';

import '@/styles/globals.css';

const globalColors: {
  [key: string]: string | { [key: string]: string };
} = colors;
let style: Array<string> = [];

Object.keys(globalColors).map((variant) => {
  return Object.keys(globalColors[variant]).map((color) => {
    const value = (globalColors[variant] as { [key: string]: string })[color];
    style.push(`--${variant}-${color}: ${value}`);
  });
});

const inter = Inter({
  subsets: ['latin'],
  display: 'fallback'
});

const isDarkMode =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppHead />

      <Head>
        <style>
          {`
            :root, :before, :after {
              ${style.join(';')}
            }
          `}
        </style>
      </Head>

      <div className={clsx('contents', inter.className)}>
        <ThemeProvider theme={getTheme(isDarkMode ? 'dark' : 'light')}>
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
