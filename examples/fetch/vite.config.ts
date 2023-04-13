import { defineConfig } from "vite"
import "dotenv/config"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig(() => {
  if (!process.env.VITE_KUBERNETES_API_URL) {
    console.log("⚠️  WARNING ⚠️ :environment variable VITE_KUBERNETES_API_URL is not defined. API may not be working!")
  }
  return {
    root: path.resolve(__dirname, "src"),
    resolve: {
      alias: {
        "~bootstrap": path.resolve(__dirname, "../../node_modules/bootstrap"),
      },
    },
    server: {
      proxy: {
        "/apis": {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      include: ["src/**/*.{test,spec}.{js,ts}"],
    },
  }
})
