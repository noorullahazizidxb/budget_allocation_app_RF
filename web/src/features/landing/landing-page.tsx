import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, ChevronDown, PieChart, ShieldCheck, SunMoon, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { fadeUp, revealOnScroll, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Seo } from '@/seo/seo';
import { DEFAULT_DESCRIPTION, FAQ, FEATURES, STEPS, homeJsonLd } from '@/seo/site';
import { HeroPreview } from './hero-preview';

const ICONS = [Wallet, PieChart, CheckCircle2, BarChart3, ShieldCheck, SunMoon];
const ctaClass = 'group w-full sm:w-auto';
/** Nudges a trailing arrow forward while its CTA is hovered or focused. */
const arrowClass = 'transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none';
const sectionTitle = 'text-balance text-center text-3xl font-bold tracking-tight';

/** Public, crawlable home page for guests: what the budget app does, how it works and FAQ. */
export function LandingPage() {
  return (
    <AppShell>
      <Seo path="/" jsonLd={homeJsonLd} />
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> Free budget app by DevMinds
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              DevMinds Budget App — the free budget planner and budget manager
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:mx-0">{DEFAULT_DESCRIPTION}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/sign-up" className={cn(buttonVariants({ size: 'lg' }), ctaClass)}>
                Create a free account <ArrowRight className={arrowClass} />
              </Link>
              <Link to="/sign-in" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), ctaClass)}>Sign in to your budget</Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section aria-labelledby="features" className="container py-16 sm:py-20">
        <h2 id="features" className={sectionTitle}>Budget manager features</h2>
        <motion.ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3" variants={stagger()} {...revealOnScroll}>
          {FEATURES.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.li key={f.title} variants={fadeUp} className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      <section aria-labelledby="how" className="border-y bg-muted/40 py-16 sm:py-20">
        <div className="container">
          <h2 id="how" className={sectionTitle}>How the budget planner works</h2>
          <motion.ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5" variants={stagger(0.12)} {...revealOnScroll}>
            {STEPS.map((s, i) => (
              <motion.li key={s.title} variants={fadeUp} className="rounded-xl border bg-card p-6 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section aria-labelledby="faq" className="container max-w-3xl py-16 sm:py-20">
        <h2 id="faq" className={sectionTitle}>Frequently asked questions</h2>
        <motion.div className="mt-8 space-y-3" variants={stagger(0.05)} {...revealOnScroll}>
          {FAQ.map((f) => (
            <motion.details key={f.q} variants={fadeUp} open className="group rounded-xl border bg-card shadow-sm transition-colors hover:border-primary/30">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-5 font-semibold [&::-webkit-details-marker]:hidden">
                <h3>{f.q}</h3>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </motion.details>
          ))}
        </motion.div>
      </section>

      <section aria-labelledby="get-started" className="container pb-16 sm:pb-20">
        <motion.div
          variants={fadeUp}
          {...revealOnScroll}
          className="relative isolate overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-xl shadow-primary/20 sm:px-12 sm:py-14"
        >
          <div aria-hidden className="bg-grid-contrast absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <h2 id="get-started" className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">Ready to plan your budget?</h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty opacity-90">Set a budget, split it into allocations and log your first expense in a few minutes.</p>
          <p className="mt-8">
            <Link to="/sign-up" className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }), ctaClass, 'shadow-lg')}>
              Start budgeting free <ArrowRight className={arrowClass} />
            </Link>
          </p>
        </motion.div>
      </section>
    </AppShell>
  );
}
