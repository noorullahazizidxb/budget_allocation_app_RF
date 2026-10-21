import * as yup from 'yup';
import { z } from 'zod';

export const allocationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60),
  amount: z.coerce.number({ invalid_type_error: 'Enter an amount' }).min(0, 'Must be 0 or more'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a color'),
});

export const expenseSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: 'Enter an amount' }).positive('Must be greater than 0'),
  note: z.string().trim().max(200).optional().default(''),
});

/** Budget settings use yup to demonstrate the dual-resolver support in lib/form.ts. */
export const budgetSettingsSchema = yup.object({
  budget: yup.number().typeError('Enter a number').min(0, 'Must be 0 or more').required('Required'),
  currency: yup.string().oneOf(['USD', 'EUR', 'GBP', 'AFN', 'INR', 'AED', 'PKR'], 'Unsupported currency').required(),
});

export type AllocationValues = z.infer<typeof allocationSchema>;
export type ExpenseValues = z.infer<typeof expenseSchema>;
export type BudgetSettingsValues = yup.InferType<typeof budgetSettingsSchema>;

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AFN', 'INR', 'AED', 'PKR'] as const;
export const PALETTE = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#ef4444', '#06b6d4', '#eab308', '#ec4899'];
