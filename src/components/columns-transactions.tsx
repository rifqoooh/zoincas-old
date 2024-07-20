'use client';

import { MoreHorizontalIcon, ShoppingBagIcon } from 'lucide-react';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { cn, convertFromMiliunits, formatCurrency } from '@/lib/utils';
import { transactions } from '@/lib/supabase/schema';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
import { useTransactionSheet } from '@/hooks/zustand/use-transaction-sheet';
import { useConnectBudgetModal } from '@/hooks/zustand/use-connect-budget-modal';
import { useDeleteTransaction } from '@/query/transactions';

const selectSchema = createSelectSchema(transactions)
  .omit({
    accountId: true,
    categoryId: true,
    createdAt: true,
  })
  .extend({
    account: z.string(),
    category: z.string().nullable(),
    budgetCategory: z.string().nullable(),
    shoppingPlanAmount: z.number(),
  });

type TransactionType = z.infer<typeof selectSchema>;

export const columns: ColumnDef<TransactionType>[] = [
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
    accessorKey: 'datetime',
    header: 'Datetime',
    cell: ({ row }) => {
      const datetime = new Date(row.getValue('datetime'));

      const formattedDate = format(datetime, 'dd MMM yyyy');
      const formattedTime = format(datetime, 'hh:mm a');

      return (
        <div className="flex flex-col gap-0.5">
          <p>{formattedDate}</p>
          <p className="text-xs text-muted-foreground">{formattedTime}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const { description, category, budgetCategory, shoppingPlanId } =
        row.original;

      return (
        <div className="flex flex-col gap-2">
          <Badge
            variant="outline"
            className={cn(
              'w-min text-nowrap',
              {
                'border-green-600 bg-green-100 text-green-600':
                  !!budgetCategory,
              },
              {
                'text-rose-600': !category && !budgetCategory,
              }
            )}
          >
            {budgetCategory || category || 'Uncategorized'}
          </Badge>

          <div className="flex w-[300px] items-center gap-1 truncate pl-2">
            {shoppingPlanId && (
              <span>
                <ShoppingBagIcon className="size-4 shrink-0" />
              </span>
            )}
            {description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'account',
    header: 'Account',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const { amount, shoppingPlanAmount } = row.original;

      const isPositiveNum = amount >= 0;

      return (
        <div
          className={cn(
            'whitespace-nowrap text-nowrap text-right font-medium tabular-nums',
            { 'text-green-500': isPositiveNum },
            { 'text-red-500': !isPositiveNum || shoppingPlanAmount }
          )}
        >
          {shoppingPlanAmount
            ? formatCurrency(convertFromMiliunits(shoppingPlanAmount * -1))
            : formatCurrency(convertFromMiliunits(amount))}
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
  const { id, budgetCategoryId } = row.original as TransactionType;

  const transactionSheetStore = useTransactionSheet();
  const connectBudgetModalStore = useConnectBudgetModal();

  const deleteMutation = useDeleteTransaction(id);

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Transaction',
    description:
      'Just checking - are you sure you want to delete this transaction?',
  });

  const onDelete = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      toast.promise(deleteMutation.mutateAsync(), {
        loading: 'Deleting transaction...',
        success: 'Transaction deleted successfully',
        error: 'Failed to delete transaction',
      });
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
        <DropdownMenuContent align="end" className="z-0">
          <DropdownMenuItem onClick={() => connectBudgetModalStore.onOpen(id)}>
            {budgetCategoryId ? 'Edit budget' : 'Connet to budget'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => transactionSheetStore.onOpenId(id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
