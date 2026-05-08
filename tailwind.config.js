import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        primary: {
          DEFAULT: '#FF4500',
          50: '#FFF0EB',
          100: '#FFD6C7',
          200: '#FFAD8F',
          300: '#FF8457',
          400: '#FF5B1F',
          500: '#FF4500',
          600: '#CC3700',
          700: '#992900',
          800: '#661C00',
          900: '#330E00',
        },
        cyan: {
          DEFAULT: '#00D4FF',
          50: '#E6FAFF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#1AD1FF',
          500: '#00D4FF',
          600: '#00AACC',
          700: '#007F99',
          800: '#005566',
          900: '#002A33',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          50: '#1A1A2E',
          100: '#16162A',
          200: '#121226',
          300: '#0E0E22',
          400: '#0C0C1E',
          500: '#0A0A0A',
        },
        gold: '#FFD700',
        surface: '#1A1A2E',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        racing: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'turbo-spin': 'turboSpin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'engine-pulse': 'enginePulse 1.5s ease-in-out infinite',
        'drift-in': 'driftIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'nitro-glow': 'nitroGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

