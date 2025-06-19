/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./imports/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Military-grade purple accents
        purple: {
          primary: '#7635A4',
          secondary: '#A2A1FF', 
          dark: '#3A0068',
        },
        // Grayscale palette
        gray: {
          light: '#D2D2D2',
          medium: '#9F9F9F',
          'medium-alt': '#BABABA',
          dark: '#636363',
          darker: '#323232',
          darkest: '#313131',
        },
      },
    },
  },
  plugins: [],
} 