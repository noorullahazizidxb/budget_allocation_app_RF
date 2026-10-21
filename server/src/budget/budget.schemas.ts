import { z } from 'zod';

const money = z.coerce.number().finite().min(0).max(1e12);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const updateBudgetSchema = z.object({
  budget: money.optional(),
  currency: z.string().trim().min(1).max(8).optional(),
});
export const createAllocationSchema = z.object({
  name: z.string().trim().min(1).max(60),
  amount: money.default(0),
  color: color.default('#3b82f6'),
});
export const updateAllocationSchema = createAllocationSchema.partial();
export const createExpenseSchema = z.object({
  amount: money.refine((n) => n > 0, 'Must be greater than 0'),
  note: z.string().trim().max(200).default(''),
});

export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type CreateAllocationDto = z.infer<typeof createAllocationSchema>;
export type UpdateAllocationDto = z.infer<typeof updateAllocationSchema>;
export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
