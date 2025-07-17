/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EBF2FF',
          100: '#D6E4FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          50: '#F3F0FF',
          100: '#E9E2FF',
          500: '#8B5CF6',
          600: '#7C3AED',
        }
      },
    },
  },
  plugins: [],
}