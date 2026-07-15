'use client';

import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  children: React.ReactElement;
  className?: string;
  height?: number;
}

export function ChartContainer({ children, className, height = 320 }: ChartContainerProps) {
  return (
    <div className={cn('w-full rounded-xl border bg-card p-4', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
