'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { SquarePenIcon } from 'lucide-react';
import { useBudgetCategoryModal } from '@/hooks/zustand/use-budget-category-modal';

interface DataType {
  id: string;
  name: string | null;
  amount: number | null;
  spend: number;
}

interface BarListProps {
  data: DataType[];
}

export function BudgetBarList({ data }: BarListProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (data.length === 0)
    return (
      <div className="flex h-20 items-center justify-center rounded-md bg-slate-100">
        <p className="text-muted-foreground">No categories</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid w-full gap-6 xl:grid-cols-2">
        {data.map((value, index) => {
          if (index >= 4 && !isExpanded) return null;

          return <BudgetBar key={value.id} data={value} />;
        })}
      </div>

      {data.length > 4 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p>{isExpanded ? 'Show less' : 'Show more'}</p>
        </Button>
      )}
    </div>
  );
}

interface BudgetBarProps {
  data: DataType;
}

export function BudgetBar({ data }: BudgetBarProps) {
  const budgetCategoryModalStore = useBudgetCategoryModal();

  const width = React.useMemo(
    () =>
      data.amount === 0
        ? 0
        : Math.max(((data.amount! + data.spend) / data.amount!) * 100, 0),
    [data]
  );

  const height = cn('h-7');

  return (
    <div className="relative space-y-1.5">
      <div className="flex items-center">
        <div className="flex grow items-center gap-2">
          <Button
            className="size-8 gap-2"
            variant="outline"
            size="icon"
            onClick={() => budgetCategoryModalStore.onOpenId(data.id)}
          >
            <SquarePenIcon className="size-4" />
          </Button>
          <h1 className="truncate text-lg font-medium">{data.name}</h1>
        </div>

        <p className="font-medium">{formatCurrency(data.amount! / 1000)}</p>
      </div>
      <div className="group flex w-full items-center rounded-md bg-slate-100">
        <div
          className={cn(
            'flex items-center rounded-md bg-orange-200 group-hover:bg-opacity-80',
            height,
            { 'bg-emerald-200': width >= 75 },
            { 'bg-rose-200': width <= 25 }
          )}
          style={{
            width: `${width}%`,
          }}
        />
        <div className="absolute left-0 flex w-full items-center justify-between px-4 text-muted-foreground">
          <p className="whitespace-nowrap text-sm">
            {formatCurrency((data.amount! + data.spend) / 1000)}
          </p>
          <p className="hidden whitespace-nowrap text-sm sm:block">
            {formatCurrency(data.spend / 1000)}
          </p>
        </div>
      </div>
    </div>
  );
}
