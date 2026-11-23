import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { cn } from '@/lib/utils';

/** Page frame: skip link, sticky header, main landmark and footer (shared by landing and dashboard). */
export function AppShell({ children, mainClassName }: { children: ReactNode; mainClassName?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className={cn('flex-1 focus:outline-none', mainClassName)}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
