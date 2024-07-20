'use client';

import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveSheetProvider } from '@/components/responsive-sheet';
import { TransactionForm } from './transaction-form';
import { useTransactionSheet } from '@/hooks/zustand/use-transaction-sheet';
import { useGetCategories } from '@/query/categories';
import { useGetAccounts } from '@/query/accounts';
import { useGetTransaction } from '@/query/transactions';

export function TransactionSheetProvider() {
  const transactionSheetStore = useTransactionSheet();

  const transactionQuery = useGetTransaction(transactionSheetStore.id);

  const categoriesQuery = useGetCategories();
  const categoriesData = categoriesQuery.data || [];
  const categoriesOptions = categoriesData.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountsQuery = useGetAccounts();
  const accountsData = accountsQuery.data || [];
  const accountsOptions = accountsData.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = transactionSheetStore.isCreating
    ? {
        title: 'Create Transaction',
        description:
          "Let's make transactions to manage your financial records.",
      }
    : {
        title: 'Edit Transaction',
        description: 'Wanna make some changes to your transaction?',
      };

  return (
    <ResponsiveSheetProvider
      title={options.title}
      description={options.description}
      isOpen={transactionSheetStore.isOpen}
      onClose={transactionSheetStore.onClose}
    >
      {transactionQuery.isLoading ||
      categoriesQuery.isLoading ||
      accountsQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <TransactionForm
          isCreating={transactionSheetStore.isCreating}
          accountsOptions={accountsOptions}
          categoriesOptions={categoriesOptions}
        />
      )}
    </ResponsiveSheetProvider>
  );
}

export function TransactionSheetTrigger() {
  const transactionSheetStore = useTransactionSheet();

  return (
    <Button className="gap-2" size="sm" onClick={transactionSheetStore.onOpen}>
      <span>Create new transaction</span>
    </Button>
  );
}
