import { PieChart as PieIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatMoney } from '@/lib/utils';
import type { Overview } from '@/stores/budget.store';

interface Slice { name: string; value: number; color: string }

function toSlices({ allocations, summary }: Overview): Slice[] {
  const slices = allocations.filter((a) => a.amount > 0).map((a) => ({ name: a.name, value: a.amount, color: a.color }));
  if (summary.unallocated > 0) slices.push({ name: 'Unallocated', value: summary.unallocated, color: 'hsl(var(--muted-foreground) / 0.25)' });
  return slices;
}

export function AllocationChart({ overview }: { overview: Overview }) {
  const { summary, currency } = overview;
  const slices = toSlices(overview);
  const pct = Math.round(summary.utilization * 100);
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution</CardTitle>
        <CardDescription>How your budget is allocated</CardDescription>
      </CardHeader>
      <CardContent>
        {slices.length ? (
          <>
            <figure className="relative h-52" aria-label={`Budget distribution chart: ${pct}% of the budget spent`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={slices} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="96%" paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {slices.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatMoney(Number(v), currency)}
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <figcaption className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <span>
                  <span className="block text-3xl font-bold tabular-nums">{pct}%</span>
                  <span className="block text-xs text-muted-foreground">of budget spent</span>
                </span>
              </figcaption>
            </figure>
            <ul className="mt-5 space-y-2 text-sm">
              {slices.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden />
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatMoney(s.value, currency)} · {total > 0 ? Math.round((s.value / total) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState icon={PieIcon} title="Nothing to chart yet" description="Set a budget and add allocations to see how it is distributed." />
        )}
      </CardContent>
    </Card>
  );
}
