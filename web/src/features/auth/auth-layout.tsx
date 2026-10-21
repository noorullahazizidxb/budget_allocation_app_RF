import { motion } from 'framer-motion';
import { PieChart, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { preloadRecaptcha } from '@/lib/recaptcha';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const perks = [
  { icon: PieChart, title: 'Allocate with clarity', text: 'Split your budget across departments and watch every dollar.' },
  { icon: Sparkles, title: 'Track in real time', text: 'Log spending and see utilization update instantly.' },
  { icon: ShieldCheck, title: 'Private & secure', text: 'Your data is protected with hashed passwords and JWT sessions.' },
];

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  useEffect(preloadRecaptcha, []);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-12 text-white dark:from-orange-700 dark:via-orange-600 dark:to-amber-500 lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <motion.div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur w-fit dark:bg-neutral-950/90">
          <Logo />
        </div>
        <div className="relative space-y-8">
          <h2 className="max-w-md text-4xl font-bold leading-tight">Every budget decision, beautifully organized.</h2>
          <ul className="space-y-5">
            {perks.map(({ icon: Icon, title: t, text }, i) => (
              <motion.li key={t} className="flex gap-4" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/15"><Icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-white/80">{text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/70">© {new Date().getFullYear()} DevMinds</p>
      </aside>

      <main className="relative flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Logo variant="compact" className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <motion.div
            className="w-full max-w-sm space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
