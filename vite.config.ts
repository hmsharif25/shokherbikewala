import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(Date.now().toString(36)),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy vendor libraries into their own chunks so:
    //   1. The initial JS payload shrinks (only React + the hero
    //      shell needs to be parsed for first paint).
    //   2. Large third-party deps (framer-motion, supabase, lucide)
    //      are cached independently, so a small app change doesn't
    //      bust the vendor cache.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/') ||
            id.includes('/react-router') ||
            id.includes('/@remix-run/')
          ) {
            return 'react-vendor'
          }

          if (
            id.includes('/framer-motion/') ||
            id.includes('/motion-utils/') ||
            id.includes('/motion-dom/')
          ) {
            return 'motion'
          }

          if (id.includes('/@supabase/')) {
            return 'supabase'
          }

          if (id.includes('/lucide-react/')) {
            return 'icons'
          }

          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
