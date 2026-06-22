/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primario: '#00E5FF',
        fondo: '#0A0C10',
        superficie: '#141820',
        texto: '#E2E8F0',
        apagado: '#64748B',
        peligro: '#FF3366',
        exito: '#00FFAA',
        borde: '#2A3140',
      },
      fontFamily: {
        encabezado: ['Space Grotesk', 'sans-serif'],
        cuerpo: ['Cabinet Grotesk', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        'pequeno': '4px',
        'mediano': '8px',
      },
      boxShadow: {
        'brillo-primario': '0 0 15px rgba(0, 229, 255, 0.2)',
        'brillo-peligro': '0 0 15px rgba(255, 51, 102, 0.3)',
      },
      transitionTimingFunction: {
        'flujo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
