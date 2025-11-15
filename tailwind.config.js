/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      colors: {
        bg: '#0E0E10',
        text: '#EAEAEA',
        accent: { light: '#E5E5E5', dark: '#B5B5B5' }
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(180deg,#E5E5E5,#B5B5B5)',
      },
    },
  },
  plugins: [],
}
