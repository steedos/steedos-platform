/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './app/**/*.{html,js}',
    './packages/**/*.{html,js}',
    './client/**/*.{html,js}',
    './imports/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
