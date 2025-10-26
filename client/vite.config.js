import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: { port: 5173 },
  optimizeDeps: { include: ['framer-motion'] },
  resolve: {
    alias: {
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion')
    }
  },
  build: {
    sourcemap: false,
    commonjsOptions: { include: [/node_modules/] },
  },
})
