'use client';

import { PlusCircleIcon } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { AccountForm } from './account-form';
import { useAccountModal } from '@/hooks/zustand/use-account-modal';
import { useGetAccount } from '@/query/accounts';

export function AccountModalProvider() {
  const accountModalStore = useAccountModal();
  const accountQuery = useGetAccount(accountModalStore.id);

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = accountModalStore.isCreating
    ? {
        title: 'Create Account',
        description:
          "Ready to take charge of your expenses? Let's create a new account together!",
      }
    : {
        title: 'Edit Account',
        description:
          "Let's make some changes! Feel free to update your account description to better suit you.",
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={accountModalStore.isOpen}
      onClose={accountModalStore.onClose}
    >
      {accountQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <AccountForm isCreating={accountModalStore.isCreating} />
      )}
    </ResponsiveModalProvider>
  );
}

export function AccountModalTrigger() {
  const accountModalStore = useAccountModal();

  return (
    <Button
      onClick={accountModalStore.onOpen}
      className="'rounded-lg shadow-sm' h-full border-2 border-dashed bg-transparent text-card-foreground hover:bg-slate-100"
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground md:flex-col md:gap-1 md:pt-1">
          <PlusCircleIcon className="size-4 md:size-7" />
          <p>Create new account</p>
        </div>
      </CardContent>
    </Button>
  );
}
