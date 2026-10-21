import { motion } from 'framer-motion';
import { Loader2, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { AllocationChart } from './allocation-chart';
import { AllocationDialog } from './allocation-dialog';
import { AllocationList } from './allocation-list';
import { BudgetSettingsDialog } from './budget-settings-dialog';
import { ExpenseDialog } from './expense-dialog';
import { RecentExpenses } from './recent-expenses';
import { SummaryCards } from './summary-cards';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { overview, load, loading, error } = useBudgetStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState<{ open: boolean; allocation: Allocation | null }>({ open: false, allocation: null });
  const [expenseFor, setExpenseFor] = useState<Allocation | null>(null);

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 space-y-6 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Hello, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="text-3xl font-bold tracking-tight">Budget overview</h1>
          </div>
          <Button variant="outline" onClick={() => setSettingsOpen(true)} disabled={!overview}><Settings2 /> Budget settings</Button>
        </motion.div>

        {!overview && loading && <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {!overview && error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm">
            Could not load your budget: {error}. <Button variant="link" onClick={() => load()}>Retry</Button>
          </div>
        )}

        {overview && (
          <>
            <SummaryCards summary={overview.summary} currency={overview.currency} />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AllocationList
                  allocations={overview.allocations}
                  currency={overview.currency}
                  onCreate={() => setEditing({ open: true, allocation: null })}
                  onEdit={(a) => setEditing({ open: true, allocation: a })}
                  onExpense={setExpenseFor}
                />
              </div>
              <div className="space-y-6">
                <AllocationChart overview={overview} />
                <RecentExpenses currency={overview.currency} />
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />

      <BudgetSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AllocationDialog open={editing.open} allocation={editing.allocation} onOpenChange={(open) => setEditing((s) => ({ ...s, open }))} />
      <ExpenseDialog allocation={expenseFor} onOpenChange={(o) => !o && setExpenseFor(null)} />
    </div>
  );
}
