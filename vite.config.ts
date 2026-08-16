import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    // Inline (empty) PostCSS config. Without this, Vite/postcss-load-config
    // searches upward through parent directories for a postcss.config.*
    // file and can accidentally pick up an unrelated one (e.g. a leftover
    // Tailwind config in your home folder) that references plugins this
    // project doesn't install. An inline object here stops that search.
    postcss: {
      plugins: [],
    },
  },
})
