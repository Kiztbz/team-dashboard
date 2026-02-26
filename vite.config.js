import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy REST + Auth API requests
      '/supabase': {
        target: 'https://xxrlgiqfnixodxwrntmh.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        secure: false,
        ws: true, // enable WebSocket proxying for Realtime
      },
    },
  },
})
