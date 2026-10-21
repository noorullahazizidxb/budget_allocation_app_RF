import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Plus, Receipt, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/lib/utils';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { withToast } from './use-submit-toast';

interface Props {
  allocations: Allocation[];
  currency: string;
  onCreate: () => void;
  onEdit: (a: Allocation) => void;
  onExpense: (a: Allocation) => void;
}

export function AllocationList({ allocations, currency, onCreate, onEdit, onExpense }: Props) {
  const remove = useBudgetStore((s) => s.deleteAllocation);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Allocations</CardTitle>
          <CardDescription>Allocated vs. spent per category</CardDescription>
        </div>
        <Button size="sm" onClick={onCreate}><Plus /> New</Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence initial={false}>
          {allocations.map((a) => {
            const pct = a.amount > 0 ? (a.spent / a.amount) * 100 : 0;
            const over = a.spent > a.amount;
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="group rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: a.color }} />
                    <p className="truncate font-medium">{a.name}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <Button variant="ghost" size="icon" aria-label={`Add expense to ${a.name}`} onClick={() => onExpense(a)}><Receipt /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Edit ${a.name}`} onClick={() => onEdit(a)}><Pencil /></Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${a.name}`}
                      onClick={() => confirm(`Delete "${a.name}" and its expenses?`) && withToast(() => remove(a.id), 'Allocation deleted')}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <Progress value={pct} className="mt-3" indicatorStyle={{ background: over ? 'hsl(var(--destructive))' : a.color }} />
                <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
                  <span className={over ? 'font-medium text-destructive' : ''}>{formatMoney(a.spent, currency)} spent</span>
                  <span>{formatMoney(a.amount, currency)} allocated</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!allocations.length && <p className="py-8 text-center text-sm text-muted-foreground">No allocations yet.</p>}
      </CardContent>
    </Card>
  );
}
