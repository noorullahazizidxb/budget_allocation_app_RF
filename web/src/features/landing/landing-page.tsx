import { ArrowRight, BarChart3, CheckCircle2, PieChart, ShieldCheck, SunMoon, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { SiteFooter } from '@/components/site-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { Seo } from '@/seo/seo';
import { DEFAULT_DESCRIPTION, FAQ, FEATURES, STEPS, homeJsonLd } from '@/seo/site';

const ICONS = [Wallet, PieChart, CheckCircle2, BarChart3, ShieldCheck, SunMoon];

/** Public, crawlable home page for guests: what the budget app does, how it works and FAQ. */
export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo path="/" jsonLd={homeJsonLd} />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="DevMinds Budget App home">
            <Logo variant="full" className="hidden sm:inline-flex" />
            <Logo variant="compact" className="sm:hidden" />
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/sign-in" className={buttonVariants({ variant: 'ghost' })}>Sign in</Link>
            <Link to="/sign-up" className={buttonVariants()}>Sign up free</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-16 text-center sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Free budget app by DevMinds</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            DevMinds Budget App — the free budget planner and budget manager
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{DEFAULT_DESCRIPTION}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/sign-up" className={buttonVariants({ size: 'lg' })}>Create a free account <ArrowRight /></Link>
            <Link to="/sign-in" className={buttonVariants({ size: 'lg', variant: 'outline' })}>Sign in to your budget</Link>
          </div>
        </section>

        <section aria-labelledby="features" className="container pb-16">
          <h2 id="features" className="text-center text-3xl font-bold tracking-tight">Budget manager features</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <li key={f.title} className="rounded-xl border bg-card p-6 text-card-foreground">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="how" className="border-y bg-muted/40 py-16">
          <div className="container">
            <h2 id="how" className="text-center text-3xl font-bold tracking-tight">How the budget planner works</h2>
            <ol className="mt-10 grid gap-5 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-xl border bg-card p-6">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="faq" className="container max-w-3xl py-16">
          <h2 id="faq" className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} open className="rounded-xl border bg-card p-5">
                <summary className="cursor-pointer font-semibold"><h3 className="inline">{f.q}</h3></summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link to="/sign-up" className={buttonVariants({ size: 'lg' })}>Start budgeting free <ArrowRight /></Link>
          </p>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
