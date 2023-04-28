import { defineConfig } from 'vite'
import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/apis': {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
