import { motion } from 'framer-motion';
import { PiggyBank, Wallet, TrendingDown, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils';
import type { Summary } from '@/stores/budget.store';

export function SummaryCards({ summary, currency }: { summary: Summary; currency: string }) {
  const items = [
    { label: 'Total budget', value: summary.budget, icon: Wallet, tone: 'text-primary bg-primary/10' },
    { label: 'Allocated', value: summary.allocated, icon: Layers, tone: 'text-violet-500 bg-violet-500/10' },
    { label: 'Spent', value: summary.spent, icon: TrendingDown, tone: 'text-rose-500 bg-rose-500/10' },
    { label: 'Remaining', value: summary.remaining, icon: PiggyBank, tone: 'text-emerald-500 bg-emerald-500/10' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, tone }, i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Card className="group p-5 transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight" data-testid={`stat-${label}`}>{formatMoney(value, currency)}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
