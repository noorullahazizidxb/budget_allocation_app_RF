/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { proxy: { '/api': process.env.VITE_API_PROXY || 'http://localhost:4000' } },
  preview: { proxy: { '/api': process.env.VITE_API_PROXY || 'http://localhost:4000' } },
  build: {
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], charts: ['recharts'], motion: ['framer-motion'] } },
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true },
});
