import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          charts: ['chart.js', 'react-chartjs-2'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          qr: ['qr-scanner', 'react-qr-code'],
          utils: ['date-fns', 'zustand', 'xlsx'],
        },
      },
    },
  },
});