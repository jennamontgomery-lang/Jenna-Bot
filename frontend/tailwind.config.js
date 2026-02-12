/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: {
          orange: '#F7931A',
          light: '#F7931A20',
        }
      }
    },
  },
  plugins: [],
}
