/** reCAPTCHA v3 (invisible). No-op when no site key is configured. */
type Grecaptcha = { ready: (cb: () => void) => void; execute: (key: string, o: { action: string }) => Promise<string> };

const SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY) as string | undefined;
let loader: Promise<Grecaptcha> | null = null;

function load(): Promise<Grecaptcha> {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => {
      const g = (window as unknown as { grecaptcha: Grecaptcha }).grecaptcha;
      g.ready(() => resolve(g));
    };
    s.onerror = () => { loader = null; reject(new Error('reCAPTCHA failed to load')); };
    document.head.appendChild(s);
  });
  return loader;
}

export const preloadRecaptcha = () => { if (SITE_KEY) load().catch(() => {}); };

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null;
  return (await load()).execute(SITE_KEY, { action });
}
