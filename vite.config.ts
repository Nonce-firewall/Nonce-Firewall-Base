import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          editor: ['react-quill', 'quill'],
          supabase: ['@supabase/supabase-js'],
          forms: ['@formspree/react']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    ...(process.env.NODE_ENV === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    })
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/postgrest-js'],
    exclude: ['@supabase/supabase-js']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})