import { create } from 'zustand';
import { http } from '@/lib/api';

export interface Allocation { id: string; name: string; amount: number; color: string; spent: number }
export interface Summary { budget: number; allocated: number; spent: number; unallocated: number; remaining: number; utilization: number }
export interface Overview { budget: number; currency: string; allocations: Allocation[]; summary: Summary }
export interface Expense { id: string; amount: number; note: string; spentAt: string; allocation: { name: string; color: string } }

interface BudgetState {
  overview: Overview | null;
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  updateSettings: (data: { budget?: number; currency?: string }) => Promise<void>;
  saveAllocation: (data: { name: string; amount: number; color: string }, id?: string) => Promise<void>;
  deleteAllocation: (id: string) => Promise<void>;
  addExpense: (allocationId: string, data: { amount: number; note?: string }) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => {
  /** Every mutation returns the fresh overview; refresh recent expenses alongside (DRY). */
  const commit = async (req: Promise<Overview>) => {
    const [overview, expenses] = await Promise.all([req, http.get<Expense[]>('/budget/expenses')]);
    set({ overview, expenses, error: null });
  };

  return {
    overview: null,
    expenses: [],
    loading: false,
    error: null,
    load: async () => {
      set({ loading: true });
      try {
        await commit(http.get<Overview>('/budget'));
      } catch (e) {
        set({ error: (e as Error).message });
      } finally {
        set({ loading: false });
      }
    },
    updateSettings: (data) => commit(http.patch('/budget', data)),
    saveAllocation: (data, id) =>
      commit(id ? http.patch(`/budget/allocations/${id}`, data) : http.post('/budget/allocations', data)),
    deleteAllocation: (id) => commit(http.del(`/budget/allocations/${id}`)),
    addExpense: (allocationId, data) => commit(http.post(`/budget/allocations/${allocationId}/expenses`, data)),
    deleteExpense: (id) => commit(http.del(`/budget/expenses/${id}`)),
  };
});
