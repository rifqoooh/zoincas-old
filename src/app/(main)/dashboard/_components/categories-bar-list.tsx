'use client';

import React from 'react';
import { cn, formatCompactNumber } from '@/lib/utils';
import { useGetSummary } from '@/query/summary';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoriesBarList() {
  const summaryQuery = useGetSummary();
  const [summaryData] = summaryQuery.data || [];
  const categories = summaryData?.categories || [];

  const colors = ['#FCA5D3', '#6FE1F1', '#91D0FF', '#D0B5FD'];

  // merge data with colors
  const data = categories.map((values, index) => ({
    ...values,
    fill: colors.at(index) ?? '#1E293B',
  }));

  const widths = React.useMemo(() => {
    const maxValue = Math.max(...data.map((item) => item.amount), 0);

    return data.map((item) =>
      item.amount === 0 ? 0 : Math.max((item.amount / maxValue) * 100, 0)
    );
  }, [data]);

  const rowHeight = cn('h-8');

  if (summaryQuery.isLoading) {
    return (
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-full bg-slate-200" />
        <Skeleton className="h-8 w-full bg-slate-200" />
        <Skeleton className="h-8 w-full bg-slate-200" />
        <Skeleton className="h-8 w-full bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="flex justify-between space-x-4">
      <div className="relative w-full space-y-1.5">
        {data.map(({ name, fill }, index) => (
          <div
            key={index}
            className="group flex w-full items-center rounded-md hover:bg-slate-50"
          >
            <div
              className={cn(
                'flex items-center rounded group-hover:bg-opacity-80',
                rowHeight
              )}
              style={{ width: `${widths[index]}%`, backgroundColor: fill }}
            >
              <div className="absolute left-0 flex w-full items-center justify-between px-4">
                <p className="truncate whitespace-nowrap text-sm">{name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative space-y-1.5">
        {data.map(({ amount }, index) => (
          <div
            key={index}
            className={cn('flex items-center justify-end', rowHeight)}
          >
            <p className="truncate whitespace-nowrap text-sm tabular-nums leading-none text-muted-foreground">
              {formatCompactNumber(
                Math.abs(Number(amount.toString().slice(0, -3)))
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
