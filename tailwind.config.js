/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          glow: 'rgba(212, 175, 55, 0.4)',
          muted: 'rgba(212, 175, 55, 0.15)',
        },
        anthracite: '#0D0D0D',
        darkSurface: '#141414',
        offWhite: '#F9F7F2',
        cream: '#E5D5B8',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
