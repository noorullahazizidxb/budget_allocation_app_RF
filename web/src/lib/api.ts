import { useAuthStore } from '@/stores/auth.store';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function extractMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const m = (body as { message?: unknown }).message;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && 'fieldErrors' in m) {
    const first = Object.values((m as { fieldErrors: Record<string, string[]> }).fieldErrors)[0];
    if (first?.[0]) return first[0];
  }
  return fallback;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (res.status === 401 && token) useAuthStore.getState().signOut();
  if (!res.ok) throw new ApiError(extractMessage(body, res.statusText || 'Request failed'), res.status);
  return body as T;
}

export const http = {
  get: <T>(p: string) => api<T>(p),
  post: <T>(p: string, data?: unknown, headers?: Record<string, string>) =>
    api<T>(p, { method: 'POST', body: JSON.stringify(data ?? {}), headers }),
  patch: <T>(p: string, data?: unknown) => api<T>(p, { method: 'PATCH', body: JSON.stringify(data ?? {}) }),
  del: <T>(p: string) => api<T>(p, { method: 'DELETE' }),
};
