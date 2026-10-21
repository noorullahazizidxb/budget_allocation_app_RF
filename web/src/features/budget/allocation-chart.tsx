import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils';
import type { Overview } from '@/stores/budget.store';

export function AllocationChart({ overview }: { overview: Overview }) {
  const { summary, currency } = overview;
  const data = overview.allocations.filter((a) => a.amount > 0).map((a) => ({ name: a.name, value: a.amount, color: a.color }));
  if (summary.unallocated > 0) data.push({ name: 'Unallocated', value: summary.unallocated, color: 'hsl(var(--muted))' });
  const pct = Math.round(summary.utilization * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution</CardTitle>
        <CardDescription>How your budget is allocated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-56">
          {data.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius="68%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(Number(v), currency)}
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">Set a budget to get started</div>
          )}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{pct}%</p>
              <p className="text-xs text-muted-foreground">spent</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
