import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "algorhythm",
    project: "frontend"
  })],

  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: true
  }
})