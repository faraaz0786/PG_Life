/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',
          500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',
        },
      },
      borderRadius: { xl:'1rem','2xl':'1.25rem','3xl':'1.75rem' },
      boxShadow: {
        card: '0 6px 24px -8px rgba(15,23,42,0.12)',
        soft: '0 2px 10px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
