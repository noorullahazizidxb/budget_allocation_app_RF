import { http } from '@/lib/api';
import type { User } from '@/stores/auth.store';
import type { SignInValues, SignUpValues } from './auth.schemas';

interface AuthResult { token: string; user: User }

export const authService = {
  signIn: (v: SignInValues) => http.post<AuthResult>('/auth/sign-in', v),
  signUp: ({ name, email, password }: SignUpValues) => http.post<AuthResult>('/auth/sign-up', { name, email, password }),
};
