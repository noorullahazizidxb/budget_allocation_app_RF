import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, className, indicatorStyle }: { value?: number; className?: string; indicatorStyle?: React.CSSProperties }) {
  return (
    <ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)} value={value}>
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  );
}
