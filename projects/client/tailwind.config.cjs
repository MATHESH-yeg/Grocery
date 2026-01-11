/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed', // Violet 600
        primaryDark: '#5b21b6', // Violet 800
        secondary: '#10b981', // Emerald 500 (Green)
        accent: '#8b5cf6', // Violet 500
        surface: '#ffffff', // White
        background: '#f3f4f6', // Cool Gray
      }
    }
  },
  plugins: []
};









