'use client';

import { useIsClient } from 'usehooks-ts';
import { ShoppingBasketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveSheetProvider } from '@/components/responsive-sheet';
import { ShoppingPlanForm } from './shopping-plan-form';
import { useShoppingPlanModal } from '@/hooks/zustand/use-shopping-plan-modal';
import { useGetShoppingPlan } from '@/query/shopping-plans';

export function ShoppingPlanSheetProvider() {
  const shoppingPlanModalStore = useShoppingPlanModal();

  const shoppingPlanQuery = useGetShoppingPlan(shoppingPlanModalStore.id);

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = shoppingPlanModalStore.isCreating
    ? {
        title: 'Create Shopping Plan',
        description:
          "Before we make a plan, let's define the title of your shopping plan.",
      }
    : {
        title: 'Edit Shopping Plan',
        description:
          'Wanna make some changes? Feel free to change the title of your shopping plan.',
      };

  return (
    <ResponsiveSheetProvider
      title={options.title}
      description={options.description}
      isOpen={shoppingPlanModalStore.isOpen}
      onClose={shoppingPlanModalStore.onClose}
    >
      {shoppingPlanQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <ShoppingPlanForm isCreating={shoppingPlanModalStore.isCreating} />
      )}
    </ResponsiveSheetProvider>
  );
}

export function ShoppingPlanModalTrigger() {
  const shoppingPlanModalStore = useShoppingPlanModal();

  return (
    <Button
      onClick={shoppingPlanModalStore.onOpen}
      className="'rounded-lg shadow-sm' h-full border-2 border-dashed bg-transparent text-card-foreground hover:bg-slate-100"
    >
      <CardContent className="flex h-full cursor-pointer items-center justify-center p-6">
        <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground md:flex-col md:gap-1 md:pt-1">
          <ShoppingBasketIcon className="size-4 md:size-7" />
          <p>Create new shopping plan</p>
        </div>
      </CardContent>
    </Button>
  );
}
