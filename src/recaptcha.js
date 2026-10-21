// reCAPTCHA v3 (invisible) client helper.
export const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6Le88_ctAAAAAO3lfOo3F17MfgJvIak9ZGnq-YkG';
let loader = null;

function load() {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => window.grecaptcha.ready(() => resolve(window.grecaptcha));
    s.onerror = () => { loader = null; reject(new Error('reCAPTCHA failed to load')); };
    document.head.appendChild(s);
  });
  return loader;
}

export const preloadRecaptcha = () => { load().catch(() => {}); };
export const getRecaptchaToken = async (action) => (await load()).execute(SITE_KEY, { action });
