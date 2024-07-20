'use client';

import { toast } from 'sonner';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetShoppingItems,
  useDeleteShoppingItems,
} from '@/query/shopping-items';

interface ShoppingPlanTableProps {
  id: string;
}

export function ShoppingPlanTable({ id }: ShoppingPlanTableProps) {
  const shoppingItemsQuery = useGetShoppingItems(id);
  const shoppingItemsData = shoppingItemsQuery.data || [];

  const deleteMutation = useDeleteShoppingItems();
  const isPending = deleteMutation.isPending;

  if (shoppingItemsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-56 bg-slate-200" />
          <Skeleton className="h-10 w-24 bg-slate-200" />
        </div>

        <Skeleton className="h-36 rounded-md bg-slate-200" />
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={shoppingItemsData}
      filterKey="name"
      alertDialog={{
        title: 'Delete item',
        description:
          'Just checking - are you sure you want to delete this many items?',
      }}
      onDelete={(rows) => {
        const ids = rows.map((row) => row.original.id);

        toast.promise(deleteMutation.mutateAsync({ ids: ids }), {
          loading: 'Deleting items...',
          success: 'Items deleted successfully',
          error: 'Failed to delete items',
        });
      }}
      disabled={isPending}
    />
  );
}
