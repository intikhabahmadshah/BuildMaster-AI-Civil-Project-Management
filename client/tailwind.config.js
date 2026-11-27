/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civil: {
          dark: '#0a0f1d',
          surface: '#111827',
          panel: '#1f293d',
          accent: '#0284c7', // Steel blue
          blueprint: '#38bdf8', // Neon blueprint cyan
          safety: '#f59e0b', // Construction safety amber
          concrete: '#94a3b8',
          border: 'rgba(56, 189, 248, 0.15)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
