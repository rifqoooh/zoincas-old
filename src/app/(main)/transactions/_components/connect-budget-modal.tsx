'use client';

import { useIsClient } from 'usehooks-ts';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { ConnectBudgetForm } from './connect-budget-form';
import { useConnectBudgetModal } from '@/hooks/zustand/use-connect-budget-modal';
import {
  useGetBudgetPlanCategories,
  useGetBudgetPlans,
} from '@/query/budget-plans';
import { useGetTransactionBudget } from '@/query/transactions';

export function ConnectBudgetModalProvider() {
  const connectBudgetModalStore = useConnectBudgetModal();
  const transactionBudgetQuery = useGetTransactionBudget(
    connectBudgetModalStore.id
  );

  const budgetPlansQuery = useGetBudgetPlans();
  const budgetPlansData = budgetPlansQuery.data || [];
  const plansOptions = budgetPlansData.map((budgetPlan) => ({
    label: budgetPlan.title,
    value: budgetPlan.id,
  }));

  const budgetPlanCategoriesQuery = useGetBudgetPlanCategories();
  const planCategoriesData = budgetPlanCategoriesQuery.data || {};

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = connectBudgetModalStore.isConnecting
    ? {
        title: 'Connect to budget plan',
        description:
          'Connect this transaction to a budget plan for better budgeting.',
      }
    : {
        title: 'Edit to budget plan',
        description:
          "Change this transaction's budget plan for better budgeting.",
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={connectBudgetModalStore.isOpen}
      onClose={connectBudgetModalStore.onClose}
    >
      {transactionBudgetQuery.isLoading || budgetPlansQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <ConnectBudgetForm
          plansOptions={plansOptions}
          planCategoriesData={planCategoriesData}
        />
      )}
    </ResponsiveModalProvider>
  );
}
