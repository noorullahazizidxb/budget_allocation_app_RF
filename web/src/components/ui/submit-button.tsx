import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from './button';

/** Form submit button that disables itself and shows a spinner while the form is submitting. */
export function SubmitButton({ pending, children, ...props }: ButtonProps & { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
