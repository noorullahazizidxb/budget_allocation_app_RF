import { motion, type Variants } from 'framer-motion';
import { duration, ease, fadeUp, revealOnMount, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

const SAMPLE = [
  { name: 'Marketing', spent: 62, color: '#3b82f6' },
  { name: 'Operations', spent: 38, color: '#10b981' },
  { name: 'Travel', spent: 81, color: '#f97316' },
] as const;

const TOTAL_USED = 60;

/** A bar that fills from the left to its share; scaleX keeps the fill on the compositor (no layout work). */
const fill: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: duration.slow * 2, ease: ease.out } },
};

function Bar({ value, color, className }: { value: number; color?: string; className: string }) {
  return (
    <span className={cn('block overflow-hidden rounded-full bg-secondary', className)}>
      <motion.span
        variants={fill}
        className="block h-full origin-left rounded-full bg-primary"
        style={{ width: `${value}%`, background: color }}
      />
    </span>
  );
}

/** Decorative dashboard preview for the landing hero (hidden from assistive tech). */
export function HeroPreview() {
  return (
    <motion.div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none" variants={stagger(0.12, 0.1)} {...revealOnMount}>
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl" />
      <motion.div variants={fadeUp} className="rounded-2xl border bg-card p-5 shadow-xl sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-muted-foreground">Monthly budget</p>
          <p className="text-xs font-semibold text-primary">{TOTAL_USED}% used</p>
        </div>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">$4,800</p>
        <motion.div variants={stagger(0.12, 0.15)}>
          <Bar value={TOTAL_USED} className="mt-4 h-2.5" />
          <ul className="mt-6 space-y-4">
            {SAMPLE.map((a) => (
              <li key={a.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{a.spent}%</span>
                </div>
                <Bar value={a.spent} color={a.color} className="mt-2 h-1.5" />
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
