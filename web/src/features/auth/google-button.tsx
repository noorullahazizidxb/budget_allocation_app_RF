import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

const ERRORS: Record<string, string> = {
  google_cancelled: 'Google sign-in was cancelled.',
  google_email_unverified: 'Your Google email is not verified, so we could not sign you in.',
  google_account_conflict: 'This email is already linked to a different Google account.',
  google_state_mismatch: 'Your Google sign-in session expired. Please try again.',
  google_unavailable: 'Google sign-in is not available right now.',
};
export const googleErrorMessage = (code: string) => ERRORS[code] ?? 'Google sign-in failed. Please try again.';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.8 3.36 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.54 0 9.21-3.9 9.21-9.38 0-.63-.07-1.11-.15-1.6H12z" />
  </svg>
);

/** Full-page navigation to the server-side OAuth start route. Shows ?error= from a failed callback. */
export function GoogleButton() {
  const [params, setParams] = useSearchParams();
  const error = params.get('error');
  useEffect(() => {
    if (!error) return;
    toast.error(googleErrorMessage(error));
    params.delete('error');
    setParams(params, { replace: true });
  }, [error, params, setParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <a href={`${BASE}/auth/google`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}>
        <GoogleIcon /> Continue with Google
      </a>
    </div>
  );
}
