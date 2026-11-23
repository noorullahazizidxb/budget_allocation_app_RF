import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { SubmitButton } from '@/components/ui/submit-button';
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
    if (open) reset(allocation ? { name: allocation.name, amount: allocation.amount, color: allocation.color } : { name: '', amount: 0, color: PALETTE[0].value });
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
          <FormField label="Name" placeholder="e.g. Marketing" autoFocus error={errors.name?.message} {...register('name')} />
          <FormField
            label="Allocated amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-sm font-medium leading-none">Color</legend>
            <div role="radiogroup" aria-label="Allocation color" className="flex flex-wrap gap-2">
              {PALETTE.map(({ value: c, name }) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={color === c}
                  aria-label={name}
                  onClick={() => setValue('color', c, { shouldDirty: true })}
                  className={cn(
                    'grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-105',
                    color === c && 'ring-2 ring-foreground ring-offset-2 ring-offset-card',
                  )}
                >
                  <span className="h-8 w-8 rounded-full" style={{ background: c }} />
                </button>
              ))}
            </div>
            {errors.color?.message && <p role="alert" className="text-xs font-medium text-destructive">{errors.color.message}</p>}
          </fieldset>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <SubmitButton pending={isSubmitting}>{allocation ? 'Save changes' : 'Create allocation'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
