import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

const prefersDark = () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const resolveTheme = (t: Theme): 'light' | 'dark' => (t === 'system' ? (prefersDark() ? 'dark' : 'light') : t);

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const apply = (resolved: 'light' | 'dark') => document.documentElement.classList.toggle('dark', resolved === 'dark');

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolved: resolveTheme('system'),
      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        apply(resolved);
        set({ theme, resolved });
      },
      toggle: () => get().setTheme(get().resolved === 'dark' ? 'light' : 'dark'),
    }),
    {
      name: 'bm-theme',
      partialize: (s) => ({ theme: s.theme }) as ThemeState,
      onRehydrateStorage: () => (s) => s && s.setTheme(s.theme),
    },
  ),
);
