import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { SubmitButton } from '@/components/ui/submit-button';
import { FormField } from '@/components/ui/form-field';
import { schemaResolver } from '@/lib/form';
import { AuthLayout } from './auth-layout';
import { GoogleButton } from './google-button';
import { signInSchema, type SignInValues } from './auth.schemas';
import { authService } from './auth.service';
import { PasswordToggle } from './password-toggle';
import { useAuthSubmit } from './use-auth-submit';

export function SignInPage() {
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInValues>({
    resolver: schemaResolver<SignInValues>(signInSchema),
  });
  const onSubmit = useAuthSubmit(authService.signIn, (u) => `Welcome back, ${u.name}!`);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your budget.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" type="email" autoComplete="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
        <FormField
          label="Password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          trailing={<PasswordToggle visible={show} onToggle={() => setShow((v) => !v)} />}
          {...register('password')}
        />
        <SubmitButton className="w-full" size="lg" pending={isSubmitting}>
          Sign in
        </SubmitButton>
      </form>
      <GoogleButton />
      <p className="text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link to="/sign-up" className="rounded-sm font-medium text-primary underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
