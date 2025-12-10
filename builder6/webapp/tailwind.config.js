module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    '../../services/**/*.{json,client.js}',
    '../../packages/**/*.{json,client.js}'
  ],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
