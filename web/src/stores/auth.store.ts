import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User { id: string; name: string; email: string }

interface AuthState {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: 'bm-auth' },
  ),
);
