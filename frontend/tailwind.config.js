/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF8F3',
        sand: '#F3EDE3',
        ink: '#2B2622',
        clay: {
          50: '#FAF4F0',
          100: '#F3E4DA',
          200: '#E7C7B5',
          300: '#D9A98C',
          400: '#C98A66',
          500: '#B86E48',
          600: '#9D573A',
          700: '#7E4530',
          800: '#5F3527',
          900: '#4A2A20',
        },
        sage: {
          50: '#F4F6F1',
          100: '#E5EADD',
          200: '#CAD5BB',
          300: '#A9BC92',
          400: '#8AA26F',
          500: '#6E8755',
          600: '#566B42',
          700: '#445436',
          800: '#37432D',
          900: '#2F3927',
        },
        blush: '#F6E4DE',
        mustard: '#D8A24A',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(43, 38, 34, 0.18)',
        card: '0 18px 50px -20px rgba(43, 38, 34, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
