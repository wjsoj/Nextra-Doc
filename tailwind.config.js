/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    // Or if using `src` directory:
    './*.{js,jsx,ts,tsx,md,mdx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}