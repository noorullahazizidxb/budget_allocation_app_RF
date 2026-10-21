import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';

export function SiteHeader() {
  const { user, signOut } = useAuthStore();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Budget Manager home">
          <Logo variant="full" className="hidden sm:inline-flex" />
          <Logo variant="compact" className="sm:hidden" />
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{user.name}</span>
            </div>
          )}
          <ThemeToggle />
          {user && (
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
