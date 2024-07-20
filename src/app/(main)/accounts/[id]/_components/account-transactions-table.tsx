'use client';

import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from '@/components/columns-transactions';
import {
  useGetAccountTransactions,
  useDeleteTransactions,
} from '@/query/transactions';

export default function AccountTransactionsTable({ id }: { id: string }) {
  const accountTransactionsQuery = useGetAccountTransactions(id);
  const accountTransactionsData = accountTransactionsQuery.data || [];

  const deleteMutation = useDeleteTransactions();
  const isPending = deleteMutation.isPending;

  if (accountTransactionsQuery.isLoading) {
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
      data={accountTransactionsData}
      filterKey="description"
      alertDialog={{
        title: 'Delete Transactions',
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
