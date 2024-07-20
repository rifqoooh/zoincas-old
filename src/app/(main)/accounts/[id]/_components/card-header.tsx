'use client';

import { SquarePenIcon } from 'lucide-react';
import { CountUp } from '@/components/count-up';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionSheetTrigger } from '@/app/(main)/transactions/_components/transaction-sheet';
import { useAccountModal } from '@/hooks/zustand/use-account-modal';
import { useGetAccount } from '@/query/accounts';

export function AccountCardHeader({ id }: { id: string }) {
  const accountModalStore = useAccountModal();

  const accountQuery = useGetAccount(id);
  const [accountData] = accountQuery.data || [];

  const initialBalance = accountData?.initialBalance || 0;

  const intAmount = Math.abs(Number(initialBalance.toString().slice(0, -3)));
  const floatAmount = Math.abs(Number(initialBalance.toString().slice(-3, -1)));

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="grid gap-2">
        {accountQuery.isLoading ? (
          <Skeleton className="h-6 w-20 bg-slate-200" />
        ) : (
          <>
            <CardDescription>{accountData.name}</CardDescription>
            <CardTitle>
              <span className="text-lg text-muted-foreground">Rp</span>
              <CountUp preserveValue useEasing start={0} end={intAmount} />
              <CountUp
                preserveValue
                className="text-lg text-muted-foreground"
                useEasing
                start={0}
                end={floatAmount}
                formattingFn={(value) =>
                  `.${value.toString().padStart(2, '0')}`
                }
              />
            </CardTitle>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          className="gap-2"
          variant="outline"
          size="sm"
          onClick={() => accountModalStore.onOpenId(id)}
        >
          <SquarePenIcon className="size-4" />
          <span>Edit account</span>
        </Button>
        <TransactionSheetTrigger />
      </div>
    </CardHeader>
  );
}
