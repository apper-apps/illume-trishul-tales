/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8F3',
          100: '#FFF0E6',
          200: '#FFE0CC',
          300: '#FFCFB3',
          400: '#FFBE99',
          500: '#FF6B35',
          600: '#E65A2E',
          700: '#CC4927',
          800: '#B33820',
          900: '#992719'
        },
        gold: {
          50: '#FFFCF0',
          100: '#FFF9E0',
          200: '#FFF3C2',
          300: '#FFEDA3',
          400: '#FFE785',
          500: '#FFD700',
          600: '#E6C200',
          700: '#CCAD00',
          800: '#B39800',
          900: '#998300'
        },
        orange: {
          50: '#FFF7F0',
          100: '#FFEDE0',
          200: '#FFDCC2',
          300: '#FFCAA3',
          400: '#FFB885',
          500: '#FF9F1C',
          600: '#E68F19',
          700: '#CC7F16',
          800: '#B36F13',
          900: '#995F10'
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-saffron': 'linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-spiritual': 'linear-gradient(135deg, #FF6B35 0%, #FFD700 50%, #FF9F1C 100%)'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}