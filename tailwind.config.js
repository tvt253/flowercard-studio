/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'charm': ['Charm', 'cursive'],
        'charmonman': ['Charmonman', 'cursive'],
        'dancing': ['Dancing Script', 'cursive'],
        'pattaya': ['Pattaya', 'cursive'],
        'sriracha': ['Sriracha', 'cursive'],
        'playwrite': ['Playwrite VN', 'cursive'],
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
