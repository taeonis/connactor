import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// console.log('Vite config loaded ✅');
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', 
        changeOrigin: true, 
      },
      '/db': {
        target: 'http://localhost:5001', 
        changeOrigin: true, 
      },
    },
  },
})
