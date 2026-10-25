import { Controller, Get, HttpCode, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthResult } from './auth.service';
import { GoogleAuthError, GoogleAuthService, googleConfig, randomToken, safeEqual } from './google-auth.service';

const STATE_COOKIE = 'bm_g_oauth';
const SESSION_COOKIE = 'bm_g_session';
const COOKIE_PATH = '/api/auth/google';
const secure = () => process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

function readCookie(req: Request, name: string): string | undefined {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

const cookieOpts = (maxAgeMs: number) => ({ httpOnly: true, secure: secure(), sameSite: 'lax' as const, path: COOKIE_PATH, maxAge: maxAgeMs });
const clear = (res: Response, name: string) => res.clearCookie(name, { httpOnly: true, secure: secure(), sameSite: 'lax', path: COOKIE_PATH });

/**
 * Google OAuth 2.0 / OIDC authorization-code flow.
 * The JWT is never put in a URL: the callback stores it in a 60s httpOnly cookie scoped to
 * /api/auth/google, and the SPA swaps it for the session via POST /api/auth/google/session.
 */
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly google: GoogleAuthService) {}

  private fail(res: Response, code: string) {
    res.setHeader('Cache-Control', 'no-store');
    res.redirect(302, `${googleConfig().appUrl}/sign-in?error=${encodeURIComponent(code)}`);
  }

  @Get()
  start(@Res() res: Response) {
    const state = randomToken();
    const nonce = randomToken();
    let url: string;
    try {
      url = this.google.authorizeUrl(state, nonce);
    } catch {
      return this.fail(res, 'google_unavailable');
    }
    res.cookie(STATE_COOKIE, `${state}.${nonce}`, cookieOpts(10 * 60 * 1000));
    res.setHeader('Cache-Control', 'no-store');
    res.redirect(302, url);
  }

  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response, @Query('code') code?: string, @Query('state') state?: string, @Query('error') error?: string) {
    const stored = readCookie(req, STATE_COOKIE);
    clear(res, STATE_COOKIE);
    if (error) return this.fail(res, error === 'access_denied' ? 'google_cancelled' : 'google_failed');
    const [expectedState, nonce] = (stored ?? '').split('.');
    if (typeof state !== 'string' || !expectedState || !nonce || !safeEqual(state, expectedState)) return this.fail(res, 'google_state_mismatch');
    if (typeof code !== 'string' || !code) return this.fail(res, 'google_failed');
    try {
      const result = await this.google.signIn(code, nonce);
      res.cookie(SESSION_COOKIE, JSON.stringify(result), cookieOpts(60 * 1000));
      res.setHeader('Cache-Control', 'no-store');
      res.redirect(302, `${googleConfig().appUrl}/auth/google/complete`);
    } catch (e) {
      this.fail(res, e instanceof GoogleAuthError ? e.code : 'google_failed');
    }
  }

  @Post('session')
  @HttpCode(200)
  session(@Req() req: Request, @Res({ passthrough: true }) res: Response): AuthResult {
    const raw = readCookie(req, SESSION_COOKIE);
    clear(res, SESSION_COOKIE);
    res.setHeader('Cache-Control', 'no-store');
    try {
      const parsed = JSON.parse(raw ?? '') as AuthResult;
      if (typeof parsed?.token === 'string' && parsed.user?.id) return parsed;
    } catch {
      /* fall through */
    }
    throw new UnauthorizedException('Google sign-in session expired. Please try again.');
  }
}
