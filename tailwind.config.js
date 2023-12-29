import { light, dark } from './themes.js'
const { createThemes } = require('tw-colors')
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      borderRadius: {
        default: '0.375rem', //md
      },
    },
  },
  plugins: [
    createThemes(
      {
        light,
        dark,
      },
      { strict: true, defaultTheme: 'light' },
    ),
  ],
}
