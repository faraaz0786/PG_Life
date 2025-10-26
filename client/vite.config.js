import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: { port: 5173 },

  // ✅ New: help the optimizer prebundle framer-motion deterministically
  optimizeDeps: {
    include: ['framer-motion'],
    // Optional: if Vercel cache ever gets weird, you can also force pre-bundle:
    // force: true,
  },

  build: {
    sourcemap: false,

    // ✅ New: make Rollup treat node_modules as CJS-friendly (ESM/CJS hybrids)
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
