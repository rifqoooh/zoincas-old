'use client';

import { SquarePenIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useShoppingPlanModal } from '@/hooks/zustand/use-shopping-plan-modal';
import { useShoppingItemSheet } from '@/hooks/zustand/use-shopping-item-sheet';
import { useGetShoppingPlan } from '@/query/shopping-plans';

export function ShoppingPlanCardHeader({ id }: { id: string }) {
  const shoppingItemSheetStore = useShoppingItemSheet();
  const shoppingPlanModalStore = useShoppingPlanModal();

  const shoppingPlanQuery = useGetShoppingPlan(id);
  const [shoppingPlanData] = shoppingPlanQuery.data || [];

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="grid gap-2">
        {shoppingPlanQuery.isLoading ? (
          <Skeleton className="h-6 w-20 bg-slate-200" />
        ) : (
          <CardTitle>{shoppingPlanData.title}</CardTitle>
        )}

        <CardDescription>{id}</CardDescription>
      </div>

      <div className="flex gap-2">
        <Button
          className="gap-2"
          variant="outline"
          size="sm"
          onClick={() => shoppingPlanModalStore.onOpenId(id)}
        >
          <SquarePenIcon className="size-4" />
          <span>Edit plan title</span>
        </Button>

        <Button
          className="gap-2"
          size="sm"
          onClick={shoppingItemSheetStore.onOpen}
        >
          <span>Create new item</span>
        </Button>
      </div>
    </CardHeader>
  );
}
