import { motion } from 'framer-motion';
import { AlertTriangle, Plus, RotateCw, Settings2, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/stores/auth.store';
import { useBudgetStore, type Allocation } from '@/stores/budget.store';
import { AllocationChart } from './allocation-chart';
import { AllocationDialog } from './allocation-dialog';
import { AllocationList } from './allocation-list';
import { BudgetSettingsDialog } from './budget-settings-dialog';
import { DashboardSkeleton } from './dashboard-skeleton';
import { ExpenseDialog } from './expense-dialog';
import { RecentExpenses } from './recent-expenses';
import { SummaryCards } from './summary-cards';

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-6 sm:flex-row sm:items-center">
      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
      <p className="flex-1 text-sm">Could not load your budget: {message}</p>
      <Button variant="outline" onClick={onRetry}><RotateCw /> Try again</Button>
    </div>
  );
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { overview, load, loading, error } = useBudgetStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState<{ open: boolean; allocation: Allocation | null }>({ open: false, allocation: null });
  const [expenseFor, setExpenseFor] = useState<Allocation | null>(null);

  useEffect(() => { void load(); }, [load]);

  const createAllocation = () => setEditing({ open: true, allocation: null });
  const firstName = user?.name?.split(' ')[0];

  return (
    <AppShell mainClassName="container space-y-6 py-6 sm:py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {firstName && <p className="text-sm text-muted-foreground">Hello, {firstName} 👋</p>}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Budget overview</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="outline" onClick={() => setSettingsOpen(true)} disabled={!overview}><Settings2 /> Settings</Button>
          <Button onClick={createAllocation} disabled={!overview}><Plus /> Allocation</Button>
        </div>
      </motion.div>

      {!overview && loading && <DashboardSkeleton />}
      {!overview && !loading && error && <LoadError message={error} onRetry={() => void load()} />}

      {overview && (
        <>
          {overview.budget === 0 && (
            <EmptyState
              icon={Wallet}
              title="Start by setting your budget"
              description="Enter the total amount you want to plan for, then split it into allocations."
              action={<Button onClick={() => setSettingsOpen(true)}><Settings2 /> Set your budget</Button>}
              className="bg-card"
            />
          )}
          <SummaryCards summary={overview.summary} currency={overview.currency} />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AllocationList
                allocations={overview.allocations}
                currency={overview.currency}
                onCreate={createAllocation}
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

      <BudgetSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AllocationDialog open={editing.open} allocation={editing.allocation} onOpenChange={(open) => setEditing((s) => ({ ...s, open }))} />
      <ExpenseDialog allocation={expenseFor} onOpenChange={(o) => !o && setExpenseFor(null)} />
    </AppShell>
  );
}
