const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        ...fontFamily,
        anton: ['Anton', ...fontFamily['sans']],
      },
      colors: {
        primary: '#3F0A73',
        secondary: '#EF35F2',
        tertiary: '#601BA6',
        text: '#601BA6',
        accent: '#6BF2E5'
      },
    },
  },
  plugins: [],
};
