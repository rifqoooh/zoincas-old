import { cn } from '@/lib/utils';
import React from 'react';

interface BarListProps {
  data: {
    id: string;
    label: string;
    value: number;
  }[];
}

export function BarList({ data }: BarListProps) {
  const widths = React.useMemo(() => {
    const maxValue = Math.max(...data.map((item) => item.value), 0);
    return data.map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 0)
    );
  }, [data]);

  const rowHeight = cn('h-10');

  return (
    <div className="flex justify-between space-x-4">
      <div className="relative w-full space-y-1.5">
        {data.map(({ id, label }, index) => (
          <div
            key={id}
            className="group flex w-full items-center rounded-md hover:bg-slate-50"
          >
            <div
              className={cn(
                'flex items-center rounded bg-slate-200 group-hover:bg-slate-200/80',
                rowHeight
              )}
              style={{ width: `${widths[index]}%` }}
            >
              <div className="absolute left-0 flex w-full items-center justify-between px-4">
                <p className="truncate whitespace-nowrap">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative space-y-1.5">
        {data.map(({ id, value }) => (
          <div
            key={id}
            className={cn('flex items-center justify-end', rowHeight)}
          >
            <p className="truncate whitespace-nowrap tabular-nums leading-none text-muted-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
