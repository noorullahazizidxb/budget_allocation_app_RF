import * as React from 'react';
import { Input } from './input';
import { Label } from './label';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
}

/** Label + input + error message, wired for accessibility. Use with react-hook-form's register(). */
export const FormField = React.forwardRef<HTMLInputElement, Props>(({ label, error, id, name, trailing, ...props }, ref) => {
  const fieldId = id ?? name;
  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input id={fieldId} name={name} ref={ref} aria-invalid={!!error} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
FormField.displayName = 'FormField';
