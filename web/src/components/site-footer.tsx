import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <Logo variant="compact" />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} DevMinds. Plan smarter, spend wiser.</p>
      </div>
    </footer>
  );
}
