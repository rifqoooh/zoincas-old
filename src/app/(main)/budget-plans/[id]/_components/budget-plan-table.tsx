'use client';

import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from '@/components/columns-transactions';
import {
  useDeleteTransactions,
  useGetBudgetPlanTransactions,
} from '@/query/transactions';
import { useGetAccounts } from '@/query/accounts';

interface BudgetPlanTableProps {
  id: string;
}

export function BudgetPlanTable({ id }: BudgetPlanTableProps) {
  const budgetPlanTransactionsQuery = useGetBudgetPlanTransactions(id);
  const budgetPlanTransactionsData = budgetPlanTransactionsQuery.data || [];

  const accountsQuery = useGetAccounts();
  const accountsData = accountsQuery.data || [];
  const accountsName = accountsData.map((account) => ({ value: account.name }));

  const deleteMutation = useDeleteTransactions();
  const isPending = deleteMutation.isPending;

  if (budgetPlanTransactionsQuery.isLoading) {
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
      data={budgetPlanTransactionsData}
      filterKey="description"
      facetedFilters={[
        {
          column: 'account',
          title: 'Accounts',
          options: accountsName,
        },
      ]}
      alertDialog={{
        title: 'Delete transaction',
        description:
          'Just checking - are you sure you want to delete this many transactions?',
      }}
      onDelete={(rows) => {
        const ids = rows.map((row) => row.original.id);

        toast.promise(deleteMutation.mutateAsync({ ids: ids }), {
          loading: 'Deleting transactions...',
          success: 'Transactions deleted successfully',
          error: 'Failed to delete transactions',
        });
      }}
      disabled={isPending}
    />
  );
}
