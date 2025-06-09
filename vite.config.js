import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '/@api': resolve(__dirname, 'api'),
      '/@utils': resolve(__dirname, 'utils')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8093',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/tms/api'),
        secure: false,
        ws: true
      }
    }
  },
  optimizeDeps: {
    include: ['uview-ui']
  },
  build: {
    commonjsOptions: {
      include: [/uview-ui/, /node_modules/]
    }
  }
}) 