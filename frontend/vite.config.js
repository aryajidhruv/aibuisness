import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <-- Check this line! It must be lowercase 'react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // <-- This must perfectly match the variable name imported above
    tailwindcss()
  ],
})