/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1e1d1a',
        autumnGreen: '#2e4b3f',
        burntOrange: '#b5562b',
        warmSand: '#e9dfd3',
        cream: '#f7f3ee',
        slate: '#5c6a66',
        goldAccent: '#c8a36a',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '18px',
      },
      maxWidth: {
        wrap: '1200px'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,.08)'
      }
    }
  },
  corePlugins: { preflight: true },
  plugins: []
};
