import { cn } from '@/lib/utils';

type LogoVariant = 'full' | 'compact' | 'icon';

interface LogoProps {
  /** "full" = 366x32 one-line wordmark, "compact" = 168x32 two-line variant, "icon" = mark only. */
  variant?: LogoVariant;
  className?: string;
}

const ALT = 'Budget Manager by DevMinds';

const SOURCES: Record<LogoVariant, { light: string; dark: string; width: number; height: number }> = {
  full: { light: '/logo-light.svg', dark: '/logo-dark.svg', width: 366, height: 32 },
  compact: { light: '/logo-light-168x32.svg', dark: '/logo-dark-168x32.svg', width: 168, height: 32 },
  icon: { light: '/brand/products/budget-manager-icon-light.svg', dark: '/brand/products/budget-manager-icon-dark.svg', width: 29, height: 32 },
};

/** Brand logo: blue artwork in light mode, orange artwork in dark mode (swapped via the `dark` class). */
export function Logo({ variant = 'full', className }: LogoProps) {
  const { light, dark, width, height } = SOURCES[variant];
  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>
      <img src={light} alt={ALT} width={width} height={height} className="h-8 w-auto dark:hidden" />
      <img src={dark} alt={ALT} width={width} height={height} className="hidden h-8 w-auto dark:block" />
    </span>
  );
}

/** Responsive logo: mark on very small screens, compact wordmark on phones, full wordmark from md up. */
export function ResponsiveLogo() {
  return (
    <>
      <Logo variant="icon" className="min-[400px]:hidden" />
      <Logo variant="compact" className="hidden min-[400px]:inline-flex md:hidden" />
      <Logo variant="full" className="hidden md:inline-flex" />
    </>
  );
}
