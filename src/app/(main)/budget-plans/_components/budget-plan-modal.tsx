'use client';

import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBudgetPlanModal } from '@/hooks/zustand/use-budget-plan-modal';
import { PiggyBankIcon } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';
import { BudgetPlanForm } from './budget-plan-form';
import { useGetBudgetPlan } from '@/query/budget-plans';

export function BudgetPlanModalProvider() {
  const budgetPlanModalStore = useBudgetPlanModal();

  const budgetPlanQuery = useGetBudgetPlan(budgetPlanModalStore.id);

  const isClient = useIsClient();

  if (!isClient) return null;

  const options = budgetPlanModalStore.isCreating
    ? {
        title: 'Create Budget Plan',
        description:
          "Before we make a plan, let's define the title of your budget plan.",
      }
    : {
        title: 'Edit Budget Plan',
        description:
          'Wanna make some changes? Feel free to change the title of your budget plan.',
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={budgetPlanModalStore.isOpen}
      onClose={budgetPlanModalStore.onClose}
    >
      {budgetPlanQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
        </div>
      ) : (
        <BudgetPlanForm isCreating={budgetPlanModalStore.isCreating} />
      )}
    </ResponsiveModalProvider>
  );
}

export function BudgetPlanModalTrigger() {
  const budgetPlanModalStore = useBudgetPlanModal();

  return (
    <Button
      onClick={budgetPlanModalStore.onOpen}
      className="'rounded-lg shadow-sm' h-full border-2 border-dashed bg-transparent text-card-foreground hover:bg-slate-100"
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground md:flex-col md:gap-1 md:pt-1">
          <PiggyBankIcon className="size-4 md:size-7" />
          <p>Create new budget plan</p>
        </div>
      </CardContent>
    </Button>
  );
}
