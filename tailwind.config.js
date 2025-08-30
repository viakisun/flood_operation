/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./FloodDroneMainHub/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569'
        },
        accent: {
          cyan: '#06B6D4',
          orange: '#F97316',
          red: '#DC2626',
          amber: '#D97706',
          green: '#059669',
          purple: '#7C3AED',
          blue: '#2563EB'
        }
      }
    },
  },
  plugins: [],
}
