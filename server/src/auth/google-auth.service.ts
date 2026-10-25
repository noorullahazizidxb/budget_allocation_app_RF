import { Injectable } from '@nestjs/common';
import { randomBytes, timingSafeEqual } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AuthResult, AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

export const GOOGLE_SCOPE = 'openid email profile';
const APP_URL = (process.env.APP_URL || 'https://budget-manager.devminds.net').replace(/\/+$/, '');

/** Error codes surfaced to the sign-in page as ?error=<code> (never raw messages). */
export class GoogleAuthError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

export const googleConfig = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID?.trim() || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI?.trim() || `${APP_URL}/api/auth/google/callback`,
  appUrl: APP_URL,
});

export const randomToken = () => randomBytes(32).toString('base64url');

export const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
};

@Injectable()
export class GoogleAuthService {
  constructor(private readonly users: UsersRepository, private readonly auth: AuthService) {}

  authorizeUrl(state: string, nonce: string): string {
    const { clientId, redirectUri } = googleConfig();
    if (!clientId) throw new GoogleAuthError('google_unavailable');
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: GOOGLE_SCOPE,
      state,
      nonce,
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /** Exchanges the code, verifies the id_token (signature, aud, iss, exp, nonce) and resolves the user. */
  async signIn(code: string, nonce: string): Promise<AuthResult> {
    const { clientId, clientSecret, redirectUri } = googleConfig();
    if (!clientId || !clientSecret) throw new GoogleAuthError('google_unavailable');
    const client = new OAuth2Client({ clientId, clientSecret, redirectUri });

    let idToken: string | null | undefined;
    try {
      ({ tokens: { id_token: idToken } } = await client.getToken(code));
    } catch {
      throw new GoogleAuthError('google_exchange_failed');
    }
    if (!idToken) throw new GoogleAuthError('google_exchange_failed');

    let payload;
    try {
      // verifyIdToken checks the RS256 signature against Google's certs, aud, iss and exp.
      payload = (await client.verifyIdToken({ idToken, audience: clientId })).getPayload();
    } catch {
      throw new GoogleAuthError('google_invalid_token');
    }
    if (!payload?.sub || !payload.nonce || !safeEqual(payload.nonce, nonce)) throw new GoogleAuthError('google_invalid_token');

    const byGoogle = await this.users.findByGoogleId(payload.sub);
    if (byGoogle) return this.auth.issue(byGoogle);

    const email = payload.email?.trim().toLowerCase();
    // Never link or create on an unverified email: prevents account takeover / email squatting.
    if (!email || payload.email_verified !== true) throw new GoogleAuthError('google_email_unverified');

    const existing = await this.users.findByEmail(email);
    if (existing) {
      if (existing.googleId && existing.googleId !== payload.sub) throw new GoogleAuthError('google_account_conflict');
      return this.auth.issue(await this.users.linkGoogle(existing.id, payload.sub));
    }

    const name = (payload.name?.trim() || email.split('@')[0]).slice(0, 80);
    return this.auth.issue(await this.users.create({ name, email, passwordHash: null, googleId: payload.sub }));
  }
}
