import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore, type User } from '@/stores/auth.store';

/** Shared submit flow for sign-in / sign-up: call, store session, redirect (DRY). */
export function useAuthSubmit<T>(action: (v: T) => Promise<{ token: string; user: User }>, successMessage: (u: User) => string) {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  return async (values: T) => {
    try {
      const { token, user } = await action(values);
      setSession(token, user);
      toast.success(successMessage(user));
      navigate('/', { replace: true });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
}
