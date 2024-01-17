/** @type {import('tailwindcss').Config} */
module.exports = {
    // important: "body.steedos",
    content: [
        // '../../creator/**/*.{html,coffee,js,jsx,tsx,json}',
        '../../services/**/*.{json,client.js}',
        '../../steedos-packages/**/*.{json,client.js}',
        '../../packages/**/*.{json,client.js}'
    ],
    theme: {
      fontSize: {
        xs: '12px',
        sm: '12px',
        base: '14px',
        md: '14px',
        lg: '16px',
        xl: '18px',
      },
      extend: {
        screens: {
          '3xl': '1600px',
        },
      },
    },
    plugins: [],
  }
  