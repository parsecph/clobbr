const { colors } = require('./src/shared/colors.js');
const { mediaQueries } = require('./src/shared/mediaQueries.js');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: `${mediaQueries.xs}px`,
      sm: `${mediaQueries.sm}px`,
      md: `${mediaQueries.md}px`,
      lg: `${mediaQueries.lg}px`,
      xl: `${mediaQueries.xl}px`,
      '2xl': `${mediaQueries['2xl']}px`,
      'tall-xs': { raw: `(min-height: ${mediaQueries.xs}px)` },
      'tall-sm': { raw: `(min-height: ${mediaQueries.sm}px)` },
      'tall-md': { raw: `(min-height: ${mediaQueries.md}px)` },
      'tall-lg': { raw: `(min-height: ${mediaQueries.lg}px)` },
      'tall-xl': { raw: `(min-height: ${mediaQueries.xl}px)` },
      'tall-2xl': { raw: `(min-height: ${mediaQueries['2xl']}px)` }
    },
    extend: {
      colors: {
        primary: {
          300: colors.primary.light,
          500: colors.primary.main,
          700: colors.primary.dark
        },
        secondary: {
          300: colors.secondary.light,
          500: colors.secondary.main,
          700: colors.secondary.dark
        }
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
  safelist: [
    {
      pattern: /max-w-./
    }
  ],
  plugins: []
};
