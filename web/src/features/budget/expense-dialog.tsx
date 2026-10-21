import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { schemaResolver } from '@/lib/form';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { expenseSchema, type ExpenseValues } from './budget.schemas';
import { withToast } from './use-submit-toast';

interface Props { allocation: Allocation | null; onOpenChange: (o: boolean) => void }

export function ExpenseDialog({ allocation, onOpenChange }: Props) {
  const addExpense = useBudgetStore((s) => s.addExpense);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseValues>({
    resolver: schemaResolver<ExpenseValues>(expenseSchema),
  });
  useEffect(() => { if (allocation) reset({ amount: undefined, note: '' }); }, [allocation, reset]);

  const onSubmit = async (v: ExpenseValues) => {
    if (allocation && (await withToast(() => addExpense(allocation.id, v), 'Expense recorded'))) onOpenChange(false);
  };

  return (
    <Dialog open={!!allocation} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record expense</DialogTitle>
          <DialogDescription>Log spending against <strong>{allocation?.name}</strong>.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Amount" type="number" step="0.01" min="0" autoFocus error={errors.amount?.message} {...register('amount')} />
          <FormField label="Note (optional)" placeholder="e.g. Ad campaign" error={errors.note?.message} {...register('note')} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>Add expense</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
