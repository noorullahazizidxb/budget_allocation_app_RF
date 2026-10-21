import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SignInPage } from '@/features/auth/sign-in-page';
import { SignUpPage } from '@/features/auth/sign-up-page';
import { DashboardPage } from '@/features/budget/dashboard-page';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

const Protected = ({ children }: { children: ReactNode }) =>
  useAuthStore((s) => s.token) ? <>{children}</> : <Navigate to="/sign-in" replace />;
const GuestOnly = ({ children }: { children: ReactNode }) =>
  useAuthStore((s) => s.token) ? <Navigate to="/" replace /> : <>{children}</>;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<GuestOnly><SignInPage /></GuestOnly>} />
      <Route path="/sign-up" element={<GuestOnly><SignUpPage /></GuestOnly>} />
      <Route path="/" element={<Protected><DashboardPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const theme = useThemeStore((s) => s.resolved);
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster theme={theme} richColors position="top-right" />
    </BrowserRouter>
  );
}
