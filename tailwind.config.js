/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'dancing': ['Dancing Script', 'cursive'],
        'alex-brush': ['Alex Brush', 'cursive'],
        'pacifico': ['Pacifico', 'cursive'],
        'playfair': ['Playfair Display', 'serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'rose-ribbon': '#e11d48',
        'gold-ribbon': '#b45309',
      }
    },
  },
  plugins: [],
}
