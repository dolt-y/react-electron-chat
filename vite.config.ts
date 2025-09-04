import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [react(),electron([{
    entry: "electron/main.ts",
    vite: {
      build: {
        outDir: "dist-electron"
      }
    }
  }, {
    entry: "electron/preload.ts",
    vite: {
      build: {
        outDir: "dist-electron"
      }
    }
  }])],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/style/variables.scss" as *;`,
      },
    },
  },
})