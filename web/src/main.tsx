import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// index.html ships a static SEO base for crawlers that do not run JavaScript.
// react-helmet-async owns those tags once React runs, so drop the static copies
// to keep exactly one title/description/canonical/robots/JSON-LD in the DOM.
document.querySelectorAll('head [data-seo]').forEach((node) => node.remove());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
