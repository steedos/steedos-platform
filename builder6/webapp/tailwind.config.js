module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    '../../services/**/*.{json,client.js}',
    '../../packages/**/*.{json,client.js}',
    "../../node_modules/@steedos-widgets/amis-object/dist/*.js",
    "../../../steedos-widgets/packages/@steedos-widgets/amis-object/dist/*.js",
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
