import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { schemaResolver } from '@/lib/form';
import { useBudgetStore } from '@/stores/budget.store';
import { budgetSettingsSchema, CURRENCIES, type BudgetSettingsValues } from './budget.schemas';
import { withToast } from './use-submit-toast';

export function BudgetSettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { overview, updateSettings } = useBudgetStore();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BudgetSettingsValues>({
    resolver: schemaResolver<BudgetSettingsValues>(budgetSettingsSchema),
  });
  useEffect(() => {
    if (open && overview) reset({ budget: overview.budget, currency: overview.currency as BudgetSettingsValues['currency'] });
  }, [open, overview, reset]);

  const onSubmit = async (v: BudgetSettingsValues) => {
    if (await withToast(() => updateSettings(v), 'Budget updated')) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Budget settings</DialogTitle>
          <DialogDescription>Set your total budget and currency.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Total budget" type="number" step="0.01" min="0" error={errors.budget?.message} {...register('budget')} />
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <select id="currency" className="h-10 rounded-md border border-input bg-background px-3 text-sm" {...register('currency')}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
