import { Receipt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { formatMoney } from '@/lib/utils';
import { useBudgetStore, type Expense } from '@/stores/budget.store';
import { withToast } from './use-submit-toast';

const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export function RecentExpenses({ currency }: { currency: string }) {
  const { expenses, deleteExpense } = useBudgetStore();
  const [deleting, setDeleting] = useState<{ open: boolean; expense: Expense | null }>({ open: false, expense: null });
  const target = deleting.expense;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Your latest recorded expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length ? (
          <ul className="-my-1 divide-y">
            {expenses.map((e) => (
              <li key={e.id} className="group flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.allocation.color }} aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.note || e.allocation.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.allocation.name} · <time dateTime={e.spentAt}>{dateFormat.format(new Date(e.spentAt))}</time>
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center">
                  <span className="text-sm font-semibold tabular-nums">−{formatMoney(e.amount, currency)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    aria-label={`Delete expense ${e.note || e.allocation.name}`}
                    title="Delete expense"
                    onClick={() => setDeleting({ open: true, expense: e })}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Receipt} title="No expenses yet" description="Use the receipt button on an allocation to record your first expense." />
        )}
      </CardContent>
      <ConfirmDialog
        open={deleting.open}
        onOpenChange={(open) => setDeleting((d) => ({ ...d, open }))}
        title="Delete this expense?"
        description={target ? `${formatMoney(target.amount, currency)} will be removed from ${target.allocation.name}.` : ''}
        confirmLabel="Delete expense"
        onConfirm={() => (target ? withToast(() => deleteExpense(target.id), 'Expense removed') : Promise.resolve(true))}
      />
    </Card>
  );
}
