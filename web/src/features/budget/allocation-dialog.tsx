import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { schemaResolver } from '@/lib/form';
import { cn } from '@/lib/utils';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { allocationSchema, PALETTE, type AllocationValues } from './budget.schemas';
import { withToast } from './use-submit-toast';

interface Props { open: boolean; onOpenChange: (o: boolean) => void; allocation?: Allocation | null }

export function AllocationDialog({ open, onOpenChange, allocation }: Props) {
  const save = useBudgetStore((s) => s.saveAllocation);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<AllocationValues>({
    resolver: schemaResolver<AllocationValues>(allocationSchema),
  });

  useEffect(() => {
    if (open) reset(allocation ? { name: allocation.name, amount: allocation.amount, color: allocation.color } : { name: '', amount: 0, color: PALETTE[0] });
  }, [open, allocation, reset]);

  const color = watch('color');
  const onSubmit = async (v: AllocationValues) => {
    if (await withToast(() => save(v, allocation?.id), allocation ? 'Allocation updated' : 'Allocation created')) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{allocation ? 'Edit allocation' : 'New allocation'}</DialogTitle>
          <DialogDescription>Assign part of your budget to a department or category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Name" placeholder="e.g. Marketing" error={errors.name?.message} {...register('name')} />
          <FormField label="Allocated amount" type="number" step="0.01" min="0" error={errors.amount?.message} {...register('amount')} />
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setValue('color', c)}
                  className={cn('h-8 w-8 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110', color === c && 'ring-2 ring-foreground')}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>{allocation ? 'Save changes' : 'Create allocation'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
