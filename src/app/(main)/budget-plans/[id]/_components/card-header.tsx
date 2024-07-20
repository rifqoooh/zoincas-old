'use client';

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SquarePenIcon } from 'lucide-react';
import { useGetBudgetPlan } from '@/query/budget-plans';
import { useBudgetPlanModal } from '@/hooks/zustand/use-budget-plan-modal';

export function BudgetPlanCardHeader({ id }: { id: string }) {
  const budgetPlanModalStore = useBudgetPlanModal();

  const budgetPlanQuery = useGetBudgetPlan(id);
  const [budgetPlanData] = budgetPlanQuery.data || [];

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="grid gap-2">
        {budgetPlanQuery.isLoading ? (
          <Skeleton className="h-6 w-20 bg-slate-200" />
        ) : (
          <CardTitle>{budgetPlanData.title}</CardTitle>
        )}

        <CardDescription>{id}</CardDescription>
      </div>

      <Button
        className="gap-2"
        variant="outline"
        size="sm"
        onClick={() => budgetPlanModalStore.onOpenId(id)}
      >
        <SquarePenIcon className="size-4" />
        <span>Edit plan title</span>
      </Button>
    </CardHeader>
  );
}
