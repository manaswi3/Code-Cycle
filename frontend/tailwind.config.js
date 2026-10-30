/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hr: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#00b862', // Signature HackerRank Green
          700: '#00843d', // Primary HackerRank Dark Green
          800: '#0b6631',
          900: '#0e141e', // Dark slate charcoal
          accent: '#00ea64',
          surface: '#f8fafc',
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
