'use client';

import { useIsClient } from 'usehooks-ts';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkTransactionForm } from './link-transaction-form';
import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { useLinkTransactionModal } from '@/hooks/zustand/use-link-transaction-modal';
import { useGetAccounts } from '@/query/accounts';
import { useGetTransactionShopping } from '@/query/transactions';

export function LinkTransactionModalProvider() {
  const linkTransctionModalStore = useLinkTransactionModal();

  const accountsQuery = useGetAccounts();
  const accountsData = accountsQuery.data || [];
  const accountsOptions = accountsData.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const transactionShoppingQuery = useGetTransactionShopping(
    linkTransctionModalStore.id
  );

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = linkTransctionModalStore.isLinking
    ? {
        title: 'Create plan as a new transaction',
        description:
          'Choose an account to make this plan as a new transaction for easier tracking.',
      }
    : {
        title: 'Edit plan',
        description: 'Edit an account that bind this plan.',
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={linkTransctionModalStore.isOpen}
      onClose={linkTransctionModalStore.onClose}
    >
      {accountsQuery.isLoading || transactionShoppingQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <LinkTransactionForm accountsOptions={accountsOptions} />
      )}
    </ResponsiveModalProvider>
  );
}
