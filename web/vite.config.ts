/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { homeJsonLd } from './src/seo/site';

/**
 * Injects the home JSON-LD from src/seo/site.ts into the static <head> so crawlers that
 * do not run JavaScript still get structured data. All other SEO lives in <head> via Helmet.
 */
const staticSeo = (): Plugin => ({
  name: 'static-seo',
  transformIndexHtml(html) {
    const jsonLd = JSON.stringify(homeJsonLd).replace(/</g, '\\u003c');
    return html.replace('<!--seo-jsonld-->', `<script type="application/ld+json" data-seo>${jsonLd}</script>`);
  },
});

export default defineConfig({
  plugins: [react(), staticSeo()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { proxy: { '/api': process.env.VITE_API_PROXY || 'http://localhost:4000' } },
  preview: { proxy: { '/api': process.env.VITE_API_PROXY || 'http://localhost:4000' } },
  build: {
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], motion: ['framer-motion'] } },
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true },
});
