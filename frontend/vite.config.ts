import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5847,
  },
  build: {
    outDir: '../backend/static',  // Build directly to backend static folder
    emptyOutDir: true,  // Clean the folder before building
  },
})
