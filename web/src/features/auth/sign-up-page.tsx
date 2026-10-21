import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { schemaResolver } from '@/lib/form';
import { AuthLayout } from './auth-layout';
import { signUpSchema, type SignUpValues } from './auth.schemas';
import { authService } from './auth.service';
import { PasswordToggle } from './password-toggle';
import { useAuthSubmit } from './use-auth-submit';

export function SignUpPage() {
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpValues>({
    resolver: schemaResolver<SignUpValues>(signUpSchema),
  });
  const onSubmit = useAuthSubmit(authService.signUp, (u) => `Account created — welcome, ${u.name}!`);
  const toggle = <PasswordToggle visible={show} onToggle={() => setShow((v) => !v)} />;

  return (
    <AuthLayout title="Create your account" subtitle="Start planning your budget in under a minute.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Full name" autoComplete="name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
        <FormField label="Email" type="email" autoComplete="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
        <FormField label="Password" type={show ? 'text' : 'password'} autoComplete="new-password" error={errors.password?.message} trailing={toggle} {...register('password')} />
        <FormField label="Confirm password" type={show ? 'text' : 'password'} autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} Create account
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
