import { Progress } from '@/components/ui/progress';

const SAMPLE = [
  { name: 'Marketing', spent: 62, color: '#3b82f6' },
  { name: 'Operations', spent: 38, color: '#10b981' },
  { name: 'Travel', spent: 81, color: '#f97316' },
] as const;

/** Decorative dashboard preview for the landing hero (hidden from assistive tech). */
export function HeroPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl" />
      <div className="rounded-2xl border bg-card p-5 shadow-xl sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-muted-foreground">Monthly budget</p>
          <p className="text-xs font-semibold text-primary">60% used</p>
        </div>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">$4,800</p>
        <Progress value={60} className="mt-4 h-2.5" />
        <ul className="mt-6 space-y-4">
          {SAMPLE.map((a) => (
            <li key={a.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                  {a.name}
                </span>
                <span className="tabular-nums text-muted-foreground">{a.spent}%</span>
              </div>
              <Progress value={a.spent} className="mt-2 h-1.5" indicatorStyle={{ background: a.color }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
