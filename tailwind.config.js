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
          DEFAULT: '#FF6A1A',
          50: '#FFF3EC',
          100: '#FFE0CC',
          200: '#FFC299',
          300: '#FFA266',
          400: '#FF8B3D',
          500: '#FF6A1A',
          600: '#E05500',
          700: '#B34400',
          800: '#803000',
          900: '#4D1D00',
        },
        cyan: {
          DEFAULT: '#00B7E5',
          50: '#E6FAFF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#1AD1FF',
          500: '#00B7E5',
          600: '#0093B8',
          700: '#006F8A',
          800: '#004B5C',
          900: '#00272F',
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
        gold: '#E0A500',
        surface: '#1A1A2E',
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        'bg-2': 'rgb(var(--c-bg-2) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted) / <alpha-value>)',
        'fg-soft': 'rgb(var(--c-fg-soft) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'surface-soft': 'rgb(var(--c-surface-soft) / <alpha-value>)',
        'surface-hover': 'rgb(var(--c-surface-hover) / <alpha-value>)',
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

