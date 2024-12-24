/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      borderRadius: {
        default: '0.375rem', //md
      },
      colors: {
        primary: 'oklch(var(--color-primary ) / <alpha-value>)',
        secondary: 'oklch(var(--color-secondary ) / <alpha-value>)',
        surface: {
          500: 'oklch(var(--color-surface-500 ) / <alpha-value>)',
          400: 'oklch(var(--color-surface-400 ) / <alpha-value>)',
          300: 'oklch(var(--color-surface-300 ) / <alpha-value>)',
          200: 'oklch(var(--color-surface-200 ) / <alpha-value>)',
          100: 'oklch(var(--color-surface-100 ) / <alpha-value>)',
          50: 'oklch(var(--color-surface-50 ) / <alpha-value>)',
        },
        highlight: 'oklch(var(--color-highlight ) / <alpha-value>)',
        warning: 'oklch(var(--color-warning ) / <alpha-value>)',
        text: {
          hard: 'oklch(var(--color-text-hard ) / <alpha-value>)',
          soft: 'oklch(var(--color-text-soft ) / <alpha-value>)',
          primary: 'oklch(var(--color-text-primary ) / <alpha-value>)',
        },
        rain: 'oklch(var(--color-rain ) / <alpha-value>)',
        sun: 'oklch(var(--color-sun ) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
