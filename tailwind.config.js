/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        petPrimary: '#FF8C42',
        petBackground: '#FEF7EE',
      },
    },
  },
  plugins: [],
};
