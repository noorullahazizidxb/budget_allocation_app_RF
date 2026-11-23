import { DevmindsProducts } from '@/components/devminds-products';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-10">
        <DevmindsProducts current="budget-manager" />
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center sm:flex-row sm:text-left">
          <Logo variant="compact" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} DevMinds. Plan smarter, spend wiser.</p>
        </div>
      </div>
    </footer>
  );
}
