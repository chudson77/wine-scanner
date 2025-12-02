/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#f7f7f5', // Stone/Beige light
          100: '#e3e3e0',
          200: '#c8c8c5',
          300: '#a5a5a0',
          400: '#85857f',
          500: '#686863',
          600: '#52524e',
          700: '#444441',
          800: '#393936',
          900: '#31312f',
          950: '#1a1a19',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d9c5',
          300: '#9bbd9b',
          400: '#749c74',
          500: '#557f55',
          600: '#416341',
          700: '#364f36',
          800: '#2d3f2d',
          900: '#263526',
          950: '#131c13',
        },
        terracotta: {
          50: '#fdf8f6',
          100: '#f2e8e5', // Warm beige
          500: '#c07762', // Terracotta
          600: '#a65d4b',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'], // Approachable, modern sans
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
  darkMode: 'media', // or 'class'
}
