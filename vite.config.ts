import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage'],
          'vendor': ['react', 'react-dom', 'zustand', '@tanstack/react-query']
        }
      }
    }
  }
});