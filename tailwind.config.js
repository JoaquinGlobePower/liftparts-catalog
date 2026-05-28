/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F8FCE9',
          100: '#EFF8CF',
          200: '#DEF2A4',
          300: '#C7E76F',
          400: '#AED843',
          500: '#90BD25',
          600: '#6F9719',
          700: '#557318',
          800: '#455C18',
          900: '#3B4E19',
          950: '#1D2B08',
        },
      },
      lineClamp: {
        2: '2',
      },
    },
  },
  plugins: [],
}
