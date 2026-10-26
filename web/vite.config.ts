/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { DEFAULT_DESCRIPTION, FAQ, FEATURES, PRODUCTS, STEPS, homeJsonLd } from './src/seo/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Fills the static SEO base of index.html from src/seo/site.ts so crawlers that do
 * not run JavaScript get the same JSON-LD and landing copy React renders at "/".
 */
const staticSeo = (): Plugin => ({
  name: 'static-seo',
  transformIndexHtml(html) {
    const jsonLd = JSON.stringify(homeJsonLd).replace(/</g, '\\u003c');
    const body = [
      '<h1>DevMinds Budget App — the free budget planner and budget manager</h1>',
      `<p>${esc(DEFAULT_DESCRIPTION)}</p>`,
      '<p><a href="/sign-up">Create a free account</a> · <a href="/sign-in">Sign in to your budget</a></p>',
      '<h2>Budget manager features</h2><ul>',
      ...FEATURES.map((f) => `<li><h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></li>`),
      '</ul><h2>How the budget planner works</h2><ol>',
      ...STEPS.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></li>`),
      '</ol><h2>Frequently asked questions</h2>',
      ...FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`),
      '<nav aria-label="DevMinds products"><h2>More DevMinds products</h2><ul>',
      ...PRODUCTS.map((p) => `<li><a href="${p.url}">${esc(p.label)}</a></li>`),
      '</ul></nav>',
    ].join('');
    return html
      .replace('<!--seo-jsonld-->', `<script type="application/ld+json" data-seo>${jsonLd}</script>`)
      .replace('<!--seo-static-->', body);
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
