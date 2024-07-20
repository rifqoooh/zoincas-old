'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BudgetBarList } from './budget-bar-list';
import { BudgetPlanModalTrigger } from './budget-plan-modal';
import { CardActions } from './budget-category-modal';
import { useGetBudgetPlansSummary } from '@/query/budget-plans';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface BudgetPlansDataType {
  id: string;
  title: string | null;
  total: number;
  budgetCategories: {
    id: string;
    name: string | null;
    amount: number | null;
    spend: number;
  }[];
}

export function BudgetPlanCards() {
  const budgetPlansQuery = useGetBudgetPlansSummary();
  const budgetPlansData = budgetPlansQuery.data || [];

  // loading state
  if (budgetPlansQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-32 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
      </>
    );
  }

  return (
    <>
      <BudgetPlanModalTrigger />
      {budgetPlansData.map((data) => (
        <BudgetPlanCard key={data.id} data={data} />
      ))}
    </>
  );
}

export function BudgetPlanCard({ data }: { data: BudgetPlansDataType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <CardDescription>{data.title}</CardDescription>
          <CardTitle>{formatCurrency(data.total / 1000)}</CardTitle>
        </div>
        <CardActions id={data.id} />
      </CardHeader>
      <CardContent className="grid gap-2 px-6">
        <BudgetBarList data={data.budgetCategories} />
      </CardContent>
    </Card>
  );
}
