/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      // ✅ Premium warm light + luxury dark palette
      colors: {
        brand: {
          50:  '#FBF8F3',
          100: '#F3ECE4',
          200: '#EADBC8',
          300: '#DCC1A1',
          400: '#CFA578',
          500: '#B68A5D',     // main bronze (light mode)
          600: '#9C744F',
          700: '#7C5B3F',
          800: '#614635',
          900: '#4C382A',
          DEFAULT: '#B68A5D',
          dark: '#C6A664',    // golden accent for dark mode
        },
        // Optional: keep a separate accent token
        accent: {
          DEFAULT: '#E4B169', // light-mode soft gold
          dark: '#C6A664',    // dark-mode gold
        },
        background: {
          light: '#FBF8F3',   // warm paper
          dark:  '#13110F',   // deep espresso
        },
        surface: {
          light: '#FFFFFF',   // cards/forms (light)
          dark:  '#1C1A17',   // cards/forms (dark)
        },
        text: {
          light: '#2C2A28',   // primary text (light)
          dark:  '#EDE8E0',   // primary text (dark)
          muted: '#B8B2A8',   // secondary in dark
        },
      },
      boxShadow: {
        card: '0 8px 28px -8px rgba(0,0,0,0.08)',
        soft: '0 2px 10px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
