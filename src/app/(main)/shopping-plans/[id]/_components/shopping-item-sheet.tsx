'use client';

import { ResponsiveSheetProvider } from '@/components/responsive-sheet';
import { useShoppingItemSheet } from '@/hooks/zustand/use-shopping-item-sheet';
import { useIsClient } from 'usehooks-ts';
import { ShoppingItemForm } from './shopping-item-form';
import { useGetShoppingItem } from '@/query/shopping-items';
import { Skeleton } from '@/components/ui/skeleton';

export function ShoppingPlanItemSheetProvider() {
  const shoppingItemSheetStore = useShoppingItemSheet();

  const shoppingPItemQuery = useGetShoppingItem(shoppingItemSheetStore.id);

  const isClient = useIsClient();

  if (!isClient) return null;

  const options = shoppingItemSheetStore.isCreating
    ? {
        title: 'Add shopping item',
        description:
          'Add new item to your shopping plan to keep it clean and organize',
      }
    : {
        title: 'Edit shopping item',
        description:
          "Let's make some changes! Feel free to update your shopping item.",
      };

  return (
    <ResponsiveSheetProvider
      title={options.title}
      description={options.description}
      isOpen={shoppingItemSheetStore.isOpen}
      onClose={shoppingItemSheetStore.onClose}
    >
      {shoppingPItemQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <ShoppingItemForm isCreating={shoppingItemSheetStore.isCreating} />
      )}
    </ResponsiveSheetProvider>
  );
}
