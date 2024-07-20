'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { MoreHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AccountModalTrigger } from './account-modal';
import { useAccountModal } from '@/hooks/zustand/use-account-modal';
import { convertFromMiliunits, formatCurrency } from '@/lib/utils';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useDeleteAccount, useGetAccounts } from '@/query/accounts';
import { accounts } from '@/lib/supabase/schema';

const selectSchema = createSelectSchema(accounts)
  .omit({
    userId: true,
    createdAt: true,
  })
  .extend({
    count: z.number(),
    total: z.number(),
  });

interface AccountCardProps {
  data: z.infer<typeof selectSchema>;
}

export function AccountCards() {
  const accountsQuery = useGetAccounts();
  const accountsData = accountsQuery.data || [];

  if (accountsQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-52 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
      </>
    );
  }

  return (
    <>
      {accountsData.map((account) => (
        <AccountCard key={account.id} data={account} />
      ))}
      <AccountModalTrigger />
    </>
  );
}

export function AccountCard({ data }: AccountCardProps) {
  return (
    <Card className="bg-gradient-to-tr from-white to-slate-50">
      <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-4">
        <CardActions id={data.id} />
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-xl">{data.name}</CardTitle>
        <CardDescription>
          {formatCurrency(
            convertFromMiliunits(data.initialBalance + data.total)
          )}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <p className="text-sm">{`${data.count} transactions`}</p>
      </CardFooter>
    </Card>
  );
}

export function CardActions({ id }: { id: string }) {
  const router = useRouter();
  const accountModalStore = useAccountModal();

  const deleteMutation = useDeleteAccount(id);
  const isPending = deleteMutation.isPending;

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Acount',
    description:
      'Just checking - are you sure you want to delete this account? All transactions related to this account will be missing as well.',
  });

  const onDelete = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      toast.promise(deleteMutation.mutateAsync(), {
        loading: 'Deleting account...',
        success: 'Account deleted successfully',
        error: 'Failed to delete account',
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 p-0" variant="ghost" disabled={isPending}>
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open row action</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              router.push(`/accounts/${id}`);
            }}
          >
            View transactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => accountModalStore.onOpenId(id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
