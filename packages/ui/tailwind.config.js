const { colors } = require('./src/shared/colors.js');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
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
