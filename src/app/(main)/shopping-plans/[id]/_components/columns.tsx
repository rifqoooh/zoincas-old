'use client';

import { MoreHorizontalIcon } from 'lucide-react';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { ColumnDef, Row } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useShoppingItemSheet } from '@/hooks/zustand/use-shopping-item-sheet';
import { useDeleteShoppingItem } from '@/query/shopping-items';
import { shoppingItems } from '@/lib/supabase/schema';

const selectSchema = createSelectSchema(shoppingItems).omit({
  shoppingPlanId: true,
  createdAt: true,
});

type ShoppingItemsType = z.infer<typeof selectSchema>;

export const columns: ColumnDef<ShoppingItemsType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="w-[350px] truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      return (
        <div className={'text-right font-medium tabular-nums'}>
          {formatCurrency(Number(row.original.amount!) / 1000)}
        </div>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-right">QTY.</div>,
    cell: ({ row }) => {
      return (
        <div className={'text-right font-medium tabular-nums'}>
          {row.original.quantity}
        </div>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: () => <div className="text-right">Discount</div>,
    cell: ({ row }) => {
      return (
        <div className={'text-right font-medium tabular-nums'}>
          {formatCurrency(Number(row.original.discount!) / 1000)}
        </div>
      );
    },
  },
  {
    accessorKey: 'tax',
    header: () => <div className="text-right">TAX</div>,
    cell: ({ row }) => {
      return (
        <div className={'text-right font-medium tabular-nums'}>
          {formatCurrency(Number(row.original.tax!) / 1000)}
        </div>
      );
    },
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      return (
        <div className={'text-right font-medium tabular-nums'}>
          {formatCurrency(Number(row.original.total!) / 1000)}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} />,
  },
];

interface RowActionsProps<TData> {
  row: Row<TData>;
}

function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const { id } = row.original as ShoppingItemsType;

  const shoppingPlanItemSheetStore = useShoppingItemSheet();

  const deleteMutation = useDeleteShoppingItem(id);

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Item',
    description: 'Just checking - are you sure you want to delete this item?',
  });

  const onDelete = async () => {
    const isConfirm = await confirm();
    if (isConfirm) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open row action</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => shoppingPlanItemSheetStore.onOpenId(id)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
