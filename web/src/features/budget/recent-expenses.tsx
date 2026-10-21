import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils';
import { useBudgetStore } from '@/stores/budget.store';
import { withToast } from './use-submit-toast';

export function RecentExpenses({ currency }: { currency: string }) {
  const { expenses, deleteExpense } = useBudgetStore();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Your latest recorded expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length ? (
          <ul className="divide-y">
            {expenses.map((e) => (
              <li key={e.id} className="group flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.allocation.color }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.note || e.allocation.name}</p>
                    <p className="text-xs text-muted-foreground">{e.allocation.name} · {new Date(e.spentAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold tabular-nums">-{formatMoney(e.amount, currency)}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100" aria-label="Delete expense" onClick={() => withToast(() => deleteExpense(e.id), 'Expense removed')}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">No expenses recorded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
