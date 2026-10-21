import { toast } from 'sonner';

/** Wraps an async action: shows success/error toasts and reports whether it succeeded. */
export async function withToast(action: () => Promise<unknown>, success: string): Promise<boolean> {
  try {
    await action();
    toast.success(success);
    return true;
  } catch (e) {
    toast.error((e as Error).message);
    return false;
  }
}
