import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F2EC',
        card: '#FFFDF9',
        line: '#E6DFD3',
        ink: '#3B4038',
        sub: '#7C8078',
        sage: '#8CA08C',
        'sage-deep': '#6E8570',
        'sage-soft': '#E8EDE4',
        clay: '#B99B8A',
        'clay-soft': '#F1E6DE',
        mist: '#A9B3BC',
        'mist-soft': '#E7EBEE',
        sand: '#D9CDBE',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Segoe UI"',
          'sans-serif',
        ],
        serif: ['"Songti SC"', '"Noto Serif SC"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(59, 64, 56, 0.04), 0 8px 24px rgba(59, 64, 56, 0.05)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.82)' },
          '50%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.45s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
