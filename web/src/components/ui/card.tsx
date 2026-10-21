import * as React from 'react';
import { cn } from '@/lib/utils';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...p }: DivProps) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...p} />
);
export const CardHeader = ({ className, ...p }: DivProps) => <div className={cn('flex flex-col gap-1.5 p-6', className)} {...p} />;
export const CardTitle = ({ className, ...p }: DivProps) => (
  <div className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...p} />
);
export const CardDescription = ({ className, ...p }: DivProps) => <div className={cn('text-sm text-muted-foreground', className)} {...p} />;
export const CardContent = ({ className, ...p }: DivProps) => <div className={cn('p-6 pt-0', className)} {...p} />;
export const CardFooter = ({ className, ...p }: DivProps) => <div className={cn('flex items-center p-6 pt-0', className)} {...p} />;
