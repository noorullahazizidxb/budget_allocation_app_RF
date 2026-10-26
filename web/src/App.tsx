import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleCompletePage } from '@/features/auth/google-complete-page';
import { SignInPage } from '@/features/auth/sign-in-page';
import { SignUpPage } from '@/features/auth/sign-up-page';
import { LandingPage } from '@/features/landing/landing-page';
import { Seo } from '@/seo/seo';
import { pageJsonLd } from '@/seo/site';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

// The dashboard pulls in charts and motion; keep them out of the landing/auth bundle.
const DashboardPage = lazy(() => import('@/features/budget/dashboard-page').then((m) => ({ default: m.DashboardPage })));

const GuestOnly = ({ children }: { children: ReactNode }) =>
  useAuthStore((s) => s.token) ? <Navigate to="/" replace /> : <>{children}</>;

/** Guests (and crawlers) get the public landing page; signed-in users get their dashboard. */
const Home = () =>
  useAuthStore((s) => s.token) ? (
    <>
      <Seo title="My budget — DevMinds Budget App" noindex />
      <Suspense fallback={null}>
        <DashboardPage />
      </Suspense>
    </>
  ) : (
    <LandingPage />
  );

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <GuestOnly>
            <Seo
              title="Sign in — DevMinds Budget App | Budget Manager"
              description="Sign in to the DevMinds Budget App to plan, allocate and track your budget. Free budget manager with email or Google sign-in."
              path="/sign-in"
              jsonLd={pageJsonLd('Sign in', '/sign-in')}
            />
            <SignInPage />
          </GuestOnly>
        }
      />
      <Route path="/auth/google/complete" element={<GuestOnly><Seo title="Signing in — DevMinds Budget App" noindex /><GoogleCompletePage /></GuestOnly>} />
      <Route
        path="/sign-up"
        element={
          <GuestOnly>
            <Seo
              title="Sign up free — DevMinds Budget App | Free Budget Planner"
              description="Create a free DevMinds Budget App account. Plan your budget, allocate it across categories and track expenses with a free budget planner."
              path="/sign-up"
              jsonLd={pageJsonLd('Sign up', '/sign-up')}
            />
            <SignUpPage />
          </GuestOnly>
        }
      />
      <Route path="/" element={<Home />} />
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
