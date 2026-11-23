import { motion } from 'framer-motion';
import { Layers, PiggyBank, TrendingDown, Wallet, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fadeUp, revealOnMount, stagger } from '@/lib/motion';
import { cn, formatMoney } from '@/lib/utils';
import type { Summary } from '@/stores/budget.store';

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  /** Share of the total budget (0..100) shown as a bar, when meaningful. */
  share?: number;
  note: string;
  /** Highlights the note as a warning (e.g. over budget). */
  warn?: boolean;
}

const percentOf = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function buildStats(summary: Summary, currency: string): Stat[] {
  const { budget, allocated, spent, unallocated, remaining } = summary;
  const over = remaining < 0;
  return [
    { label: 'Total budget', value: budget, icon: Wallet, tone: 'text-primary bg-primary/10', note: `${formatMoney(unallocated, currency)} not yet allocated` },
    { label: 'Allocated', value: allocated, icon: Layers, tone: 'text-violet-600 bg-violet-500/10 dark:text-violet-400', share: percentOf(allocated, budget), note: `${percentOf(allocated, budget)}% of budget` },
    { label: 'Spent', value: spent, icon: TrendingDown, tone: 'text-rose-600 bg-rose-500/10 dark:text-rose-400', share: percentOf(spent, budget), note: `${percentOf(spent, budget)}% of budget` },
    {
      label: 'Remaining',
      value: remaining,
      icon: PiggyBank,
      tone: over ? 'text-destructive bg-destructive/10' : 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
      note: over ? 'Over budget' : `${percentOf(remaining, budget)}% left to spend`,
      warn: over,
    },
  ];
}

export function SummaryCards({ summary, currency }: { summary: Summary; currency: string }) {
  return (
    <motion.ul
      className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 xl:grid-cols-4"
      aria-label="Budget summary"
      variants={stagger(0.06, 0.08)}
      {...revealOnMount}
    >
      {buildStats(summary, currency).map(({ label, value, icon: Icon, tone, share, note, warn }) => (
        <motion.li key={label} variants={fadeUp}>
          <Card className="h-full p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9', tone)}><Icon className="h-4 w-4" aria-hidden /></span>
            </div>
            <p
              className={cn('mt-2 text-xl font-bold tabular-nums tracking-tight sm:text-2xl', warn && 'text-destructive')}
              data-testid={`stat-${label}`}
            >
              {formatMoney(value, currency)}
            </p>
            {share !== undefined && <Progress value={share} className="mt-3 h-1.5" aria-label={`${label}: ${share}% of budget`} />}
            <p className={cn('mt-2 text-xs text-muted-foreground', warn && 'font-medium text-destructive')}>{note}</p>
          </Card>
        </motion.li>
      ))}
    </motion.ul>
  );
}
