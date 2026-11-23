import { AnimatePresence, motion } from 'framer-motion';
import { Layers, Pencil, Plus, Receipt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';
import { cn, formatMoney } from '@/lib/utils';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { withToast } from './use-submit-toast';

interface Props {
  allocations: Allocation[];
  currency: string;
  onCreate: () => void;
  onEdit: (a: Allocation) => void;
  onExpense: (a: Allocation) => void;
}

function AllocationRow({ allocation: a, currency, onEdit, onExpense, onDelete }: {
  allocation: Allocation;
  currency: string;
  onEdit: () => void;
  onExpense: () => void;
  onDelete: () => void;
}) {
  const pct = a.amount > 0 ? Math.round((a.spent / a.amount) * 100) : 0;
  const over = a.spent > a.amount;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex flex-wrap items-center gap-x-3 rounded-lg border bg-background/60 p-4 transition-colors hover:bg-muted/40 focus-within:bg-muted/40"
    >
      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: a.color }} aria-hidden />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">{a.name}</h3>
        <p className="text-xs tabular-nums text-muted-foreground">{formatMoney(Math.max(a.amount - a.spent, 0), currency)} left</p>
      </div>
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
          over ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
        )}
      >
        {over ? 'Over budget' : `${pct}%`}
      </span>
      <div className="order-last -mb-2 -mr-2 mt-1 flex w-full justify-end transition-opacity sm:order-none sm:-my-1 sm:mt-0 sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button variant="ghost" size="icon" aria-label={`Add expense to ${a.name}`} title="Add expense" onClick={onExpense}><Receipt /></Button>
        <Button variant="ghost" size="icon" aria-label={`Edit ${a.name}`} title="Edit" onClick={onEdit}><Pencil /></Button>
        <Button variant="ghost" size="icon" aria-label={`Delete ${a.name}`} title="Delete" onClick={onDelete}>
          <Trash2 className="text-destructive" />
        </Button>
      </div>
      <Progress
        value={pct}
        className="mt-3 basis-full"
        aria-label={`${a.name}: ${pct}% spent`}
        indicatorStyle={{ background: over ? 'hsl(var(--destructive))' : a.color }}
      />
      <div className="mt-2 flex basis-full justify-between gap-3 text-xs tabular-nums text-muted-foreground">
        <span className={over ? 'font-medium text-destructive' : ''}>{formatMoney(a.spent, currency)} spent</span>
        <span>{formatMoney(a.amount, currency)} allocated</span>
      </div>
    </motion.li>
  );
}

export function AllocationList({ allocations, currency, onCreate, onEdit, onExpense }: Props) {
  const remove = useBudgetStore((s) => s.deleteAllocation);
  const [deleting, setDeleting] = useState<{ open: boolean; allocation: Allocation | null }>({ open: false, allocation: null });
  const target = deleting.allocation;
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Allocations</CardTitle>
          <CardDescription>Allocated vs. spent per category</CardDescription>
        </div>
        <Button size="sm" className="h-10" onClick={onCreate}><Plus /> New</Button>
      </CardHeader>
      <CardContent>
        {allocations.length ? (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {allocations.map((a) => (
                <AllocationRow
                  key={a.id}
                  allocation={a}
                  currency={currency}
                  onEdit={() => onEdit(a)}
                  onExpense={() => onExpense(a)}
                  onDelete={() => setDeleting({ open: true, allocation: a })}
                />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <EmptyState
            icon={Layers}
            title="No allocations yet"
            description="Split your budget into categories like rent, marketing or travel to start tracking spending."
            action={<Button onClick={onCreate}><Plus /> Create your first allocation</Button>}
          />
        )}
      </CardContent>
      <ConfirmDialog
        open={deleting.open}
        onOpenChange={(open) => setDeleting((d) => ({ ...d, open }))}
        title={`Delete “${target?.name ?? ''}”?`}
        description="This removes the allocation and all of its recorded expenses. This cannot be undone."
        confirmLabel="Delete allocation"
        onConfirm={() => (target ? withToast(() => remove(target.id), 'Allocation deleted') : Promise.resolve(true))}
      />
    </Card>
  );
}
