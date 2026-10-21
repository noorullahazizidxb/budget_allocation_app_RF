// Server-side reCAPTCHA v3 verification helper.
const ALLOWED_HOSTS = ['budget-manager.devminds.net', 'ourworks.devminds.net', 'localhost'];
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

async function verifyRecaptcha(token, expectedAction, remoteip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: false, status: 500, error: 'recaptcha not configured' };
  if (!token || typeof token !== 'string') return { ok: false, status: 400, error: 'missing recaptcha token' };
  const params = new URLSearchParams({ secret, response: token });
  if (remoteip) params.set('remoteip', remoteip);
  try {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
    const d = await r.json();
    const hostOk = ALLOWED_HOSTS.includes(d.hostname);
    const scoreOk = typeof d.score !== 'number' || d.score >= MIN_SCORE;
    const actionOk = !expectedAction || !d.action || d.action === expectedAction;
    const ok = d.success === true && hostOk && scoreOk && actionOk;
    return { ok, status: ok ? 200 : 403, score: d.score, action: d.action, errors: d['error-codes'] || [] };
  } catch (e) {
    return { ok: false, status: 502, error: 'verification failed' };
  }
}

const clientIp = (req) => String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();

module.exports = { verifyRecaptcha, clientIp };
