/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#071A2F', dark: '#0B2545', 700: '#12345C', 600: '#1C4674' },
        gold: { DEFAULT: '#D9A441', dark: '#B8862B', light: '#F6E9CC' },
        page: '#F5F7FA',
        ink: '#111827',
        muted: '#6B7280',
        line: '#E3E8EF',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Oswald', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,26,47,0.06), 0 2px 8px rgba(7,26,47,0.05)',
        lift: '0 8px 24px rgba(7,26,47,0.14)',
      },
      borderRadius: { xl2: '14px' },
      keyframes: {
        fadeUp: { from: { opacity: '0.4', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { '0%': { transform: 'scale(0.6)' }, '70%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)' } },
        sheet: { from: { transform: 'translateY(24px)', opacity: '0.6' }, to: { transform: 'none', opacity: '1' } },
      },
      animation: {
        fadeUp: 'fadeUp .22s ease-out',
        pop: 'pop .22s ease-out',
        sheet: 'sheet .2s ease-out',
      },
    },
  },
  plugins: [],
};
