/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        teal: {
          light: '#ccfbf1',
          DEFAULT: '#14b8a6',
          dark: '#0f766e',
        },
        surface: {
          light: '#f8fafc',
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
