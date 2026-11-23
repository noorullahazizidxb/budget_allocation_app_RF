/** Placeholder layout shown while the budget overview loads (mirrors the real dashboard grid). */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading your budget…</span>
      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton mt-4 h-7 w-32" />
            <div className="skeleton mt-4 h-1.5 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 rounded-xl border bg-card p-6 lg:col-span-2">
          <div className="skeleton h-5 w-32" />
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-20 w-full" />)}
        </div>
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div className="skeleton h-5 w-28" />
          <div className="skeleton mx-auto h-44 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}
