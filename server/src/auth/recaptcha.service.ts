import { ForbiddenException, Injectable } from '@nestjs/common';

const DEFAULT_HOSTS = ['budget-manager.devminds.net', 'ourworks.devminds.net', 'localhost'];

/**
 * reCAPTCHA v3 verification. Enforced only when RECAPTCHA_SECRET_KEY is set (local dev stays frictionless).
 * Extra hostnames (e.g. preview domains) via RECAPTCHA_ALLOWED_HOSTS (comma separated; "*.vercel.app" style suffixes allowed).
 */
@Injectable()
export class RecaptchaService {
  private get hosts() {
    return [...DEFAULT_HOSTS, ...(process.env.RECAPTCHA_ALLOWED_HOSTS ?? '').split(',').map((h) => h.trim()).filter(Boolean)];
  }

  private hostAllowed(host?: string) {
    if (!host) return false;
    return this.hosts.some((h) => (h.startsWith('*.') ? host.endsWith(h.slice(1)) : host === h));
  }

  async assertHuman(token: string | undefined, action: string, remoteip?: string): Promise<void> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return;
    if (!token) throw new ForbiddenException('Missing reCAPTCHA token');
    const params = new URLSearchParams({ secret, response: token });
    if (remoteip) params.set('remoteip', remoteip);
    let d: { success?: boolean; score?: number; action?: string; hostname?: string };
    try {
      d = await (await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params })).json();
    } catch {
      throw new ForbiddenException('reCAPTCHA verification failed');
    }
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
    const ok = d.success === true && this.hostAllowed(d.hostname) &&
      (typeof d.score !== 'number' || d.score >= minScore) && (!d.action || d.action === action);
    if (!ok) throw new ForbiddenException('reCAPTCHA check failed, please try again');
  }
}
