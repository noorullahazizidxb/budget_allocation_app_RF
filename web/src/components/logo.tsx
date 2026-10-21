import { cn } from '@/lib/utils';

interface LogoProps {
  /** "full" = 366x32 one-line wordmark, "compact" = 168x32 two-line variant */
  variant?: 'full' | 'compact';
  className?: string;
}

/** Brand logo: blue artwork in light mode, orange artwork in dark mode (swapped via the `dark` class). */
export function Logo({ variant = 'full', className }: LogoProps) {
  const suffix = variant === 'compact' ? '-168x32' : '';
  const size = variant === 'compact' ? { width: 168, height: 32 } : { width: 366, height: 32 };
  return (
    <span className={cn('inline-flex items-center', className)}>
      <img src={`/logo-light${suffix}.svg`} alt="Budget Manager by DevMinds" {...size} className="h-8 w-auto dark:hidden" />
      <img src={`/logo-dark${suffix}.svg`} alt="Budget Manager by DevMinds" {...size} className="hidden h-8 w-auto dark:block" />
    </span>
  );
}
