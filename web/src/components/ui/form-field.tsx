import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Helper text shown under the field while there is no error. */
  hint?: string;
  trailing?: React.ReactNode;
}

/** Label + input + hint/error message, wired for accessibility. Use with react-hook-form's register(). */
export const FormField = React.forwardRef<HTMLInputElement, Props>(({ label, error, hint, id, name, trailing, className, ...props }, ref) => {
  const fieldId = id ?? name;
  const message = error ?? hint;
  const messageId = message ? `${fieldId}-${error ? 'error' : 'hint'}` : undefined;
  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input
          id={fieldId}
          name={name}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={messageId}
          className={cn(trailing && 'pr-12', className)}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {message && (
        <p id={messageId} role={error ? 'alert' : undefined} className={cn('text-xs', error ? 'font-medium text-destructive' : 'text-muted-foreground')}>
          {message}
        </p>
      )}
    </div>
  );
});
FormField.displayName = 'FormField';
