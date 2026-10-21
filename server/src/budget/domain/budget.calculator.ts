/** Pure domain logic — no framework or persistence dependencies. */
export interface AllocationLike { id: string; amount: number; spent: number }

export interface BudgetSummary {
  budget: number;
  allocated: number;
  spent: number;
  unallocated: number;
  remaining: number;
  utilization: number; // 0..1 of budget spent
}

const round = (n: number) => Math.round(n * 100) / 100;

export function summarize(budget: number, allocations: AllocationLike[]): BudgetSummary {
  const allocated = round(allocations.reduce((s, a) => s + a.amount, 0));
  const spent = round(allocations.reduce((s, a) => s + a.spent, 0));
  return {
    budget,
    allocated,
    spent,
    unallocated: round(budget - allocated),
    remaining: round(budget - spent),
    utilization: budget > 0 ? Math.min(spent / budget, 1) : 0,
  };
}

/** Would setting allocation `id` to `amount` (or adding a new one when id is null) exceed the budget? */
export function exceedsBudget(budget: number, allocations: AllocationLike[], id: string | null, amount: number) {
  const others = allocations.filter((a) => a.id !== id).reduce((s, a) => s + a.amount, 0);
  return round(others + amount) > budget;
}
