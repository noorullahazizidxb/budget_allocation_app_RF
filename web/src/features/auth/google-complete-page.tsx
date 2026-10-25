import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { http } from '@/lib/api';
import { useAuthStore, type User } from '@/stores/auth.store';

/** Landing page after the Google callback: swaps the short-lived httpOnly cookie for the app session. */
export function GoogleCompletePage() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    http
      .post<{ token: string; user: User }>('/auth/google/session')
      .then(({ token, user }) => {
        setSession(token, user);
        toast.success(`Welcome, ${user.name}!`);
        navigate('/', { replace: true });
      })
      .catch(() => navigate('/sign-in?error=google_state_mismatch', { replace: true }));
  }, [navigate, setSession]);
  return (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" aria-label="Signing you in" />
    </div>
  );
}
