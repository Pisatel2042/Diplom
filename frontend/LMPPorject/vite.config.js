import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    // На сетевых дисках (Z:) стандартный watcher часто не срабатывает — включаем polling
    watch: {
      usePolling: true,
      interval: 300,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    css: {
    devSourcemap: true,
  },
})