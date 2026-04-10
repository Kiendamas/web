import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Librerías core de React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux y estado
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          // UI y formularios
          'vendor-ui': ['@headlessui/react', '@heroicons/react', 'lucide-react', 'react-icons', 'react-hot-toast', 'react-hook-form'],
          // HTTP
          'vendor-http': ['axios'],
        },
      },
    },
  },
  
  // Solo para desarrollo
  server: {
    port: process.env.PORT || 5173,
    host: true,
    open: true,
    // Proxy solo en desarrollo
    ...(process.env.NODE_ENV !== 'production' && {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    }),
  },
});