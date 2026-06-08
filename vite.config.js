import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Defaults to '/' for Vercel. Set VITE_BASE_PATH=/wine-scanner/ in GitHub Actions for GH Pages.
  base: process.env.VITE_BASE_PATH || '/',
})
