import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
  indicatorStyle?: React.CSSProperties;
  'aria-label'?: string;
}

export function Progress({ value = 0, className, indicatorStyle, 'aria-label': ariaLabel }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <ProgressPrimitive.Root className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)} value={clamped} aria-label={ariaLabel}>
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - clamped}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  );
}
