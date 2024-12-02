/** @type {import('tailwindcss').Config} */

const {nextui} = require("@nextui-org/react");  

module.exports = {
  darkMode: 'selector',
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    // Or if using `src` directory:
    './*.{js,jsx,ts,tsx,md,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}
  },
  plugins: [
    nextui()
  ]
}