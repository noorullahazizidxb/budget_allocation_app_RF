import { Logo } from '@/components/logo';

const DEVMINDS_PRODUCTS = [
  { href: 'https://devminds.net', label: 'DevMinds — software studio' },
  { href: 'https://marketplace.devminds.net', label: 'DevMinds Marketplace — buy and sell online' },
  { href: 'https://jobs.devminds.net', label: 'DevMinds Jobs — jobs platform and education hub' },
  { href: 'https://notes.devminds.net', label: 'DevMinds Notes — note taking app' },
  { href: 'https://ourworks.devminds.net', label: 'DevMinds Works — our projects and work' },
  { href: 'https://noorullah-azizi.devminds.net', label: 'Noorullah Azizi — founder portfolio' },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <Logo variant="compact" />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} DevMinds. Plan smarter, spend wiser.</p>
      </div>
      <nav aria-label="DevMinds products" className="container border-t py-4">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {DEVMINDS_PRODUCTS.map((p) => (
            <li key={p.href}><a href={p.href} className="hover:text-foreground">{p.label}</a></li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
