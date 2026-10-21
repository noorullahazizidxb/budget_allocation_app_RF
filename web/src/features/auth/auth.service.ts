import { http } from '@/lib/api';
import { getRecaptchaToken } from '@/lib/recaptcha';
import type { User } from '@/stores/auth.store';
import type { SignInValues, SignUpValues } from './auth.schemas';

interface AuthResult { token: string; user: User }

const captchaHeaders = async (action: string): Promise<Record<string, string>> => {
  const token = await getRecaptchaToken(action);
  return token ? { 'X-Recaptcha-Token': token } : {};
};

export const authService = {
  signIn: async (v: SignInValues) => http.post<AuthResult>('/auth/sign-in', v, await captchaHeaders('sign_in')),
  signUp: async ({ name, email, password }: SignUpValues) =>
    http.post<AuthResult>('/auth/sign-up', { name, email, password }, await captchaHeaders('sign_up')),
};
