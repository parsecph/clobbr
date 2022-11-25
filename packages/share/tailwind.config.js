/** @type {import('tailwindcss').Config} */
const { colors } = require('./theme/colors');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,css}',
    './components/**/*.{js,ts,jsx,tsx,css}',
    './pages/**/*.{js,ts,jsx,tsx,css}',
    '../ui/src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: colors.primary.lighter,
          300: colors.primary.light,
          500: colors.primary.main,
          700: colors.primary.dark,
          900: colors.primary.darker
        },
        secondary: {
          100: colors.secondary.lighter,
          300: colors.secondary.light,
          500: colors.secondary.main,
          700: colors.secondary.dark,
          900: colors.secondary.darker
        }
      },

      screens: {
        'tall-sm': { raw: '(min-height: 640px)' },
        'tall-md': { raw: '(min-height: 768px)' },
        'tall-lg': { raw: '(min-height: 1024px)' },
        'tall-xl': { raw: '(min-height: 1280px)' },
        'tall-2xl': { raw: '(min-height: 1536px)' }
      },

      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        110: 110
      }
    }
  },
  plugins: []
};
