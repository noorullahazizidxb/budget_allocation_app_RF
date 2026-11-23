import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveLogo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

function GuestActions() {
  return (
    <>
      <Link to="/sign-in" className={cn(buttonVariants({ variant: 'ghost' }), 'px-3 sm:px-4')}>
        Sign in
      </Link>
      <Link to="/sign-up" className={cn(buttonVariants(), 'px-3 sm:px-4')}>
        <span>Sign up<span className="hidden sm:inline"> free</span></span>
      </Link>
    </>
  );
}

function AccountActions({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[12rem] truncate text-sm font-medium">{name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onSignOut} aria-label="Sign out" title="Sign out">
        <LogOut />
      </Button>
    </>
  );
}

/** Sticky app header shared by the landing page and the dashboard. */
export function SiteHeader() {
  const { user, signOut } = useAuthStore();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link to="/" aria-label="DevMinds Budget App home" className="rounded-md">
          <ResponsiveLogo />
        </Link>
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {user ? <AccountActions name={user.name} onSignOut={signOut} /> : <GuestActions />}
        </nav>
      </div>
    </header>
  );
}
