'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { shoppingPlans } from '@/lib/supabase/schema';
import { MoreHorizontalIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ShoppingPlanModalTrigger } from './shopping-plan-sheet';
import { useLinkTransactionModal } from '@/hooks/zustand/use-link-transaction-modal';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import {
  useGetShoppingPlans,
  useDeleteShoppingPlan,
} from '@/query/shopping-plans';

const selectSchema = createSelectSchema(shoppingPlans)
  .omit({
    userId: true,
    createdAt: true,
  })
  .extend({
    count: z.number(),
    total: z.number(),
    transactionId: z.string().nullable(),
  });

export function ShoppingPlanCards() {
  const shoppingPlansQuery = useGetShoppingPlans();
  const shoppingPlansData = shoppingPlansQuery.data || [];

  if (shoppingPlansQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-52 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
      </>
    );
  }

  return (
    <>
      {shoppingPlansData.map((shoppingPlan) => (
        <ShoppingPlanCard key={shoppingPlan.id} data={shoppingPlan} />
      ))}
      <ShoppingPlanModalTrigger />
    </>
  );
}

interface ShoppingPlanCardProps {
  data: z.infer<typeof selectSchema>;
}

export function ShoppingPlanCard({ data }: ShoppingPlanCardProps) {
  return (
    <Card className="bg-gradient-to-tr from-white to-slate-50">
      <CardHeader
        className={cn(
          'flex flex-row items-center space-y-0 pb-4',
          { 'justify-between': data.transactionId },
          { 'justify-end': !data.transactionId }
        )}
      >
        {data.transactionId && (
          <Badge
            variant="outline"
            className="border-green-600 bg-green-100 text-green-600"
          >
            Linked
          </Badge>
        )}
        <CardActions id={data.id} />
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-xl">{data.title}</CardTitle>
        <CardDescription>{formatCurrency(data.total / 1000)}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm">
          {data.count === 0
            ? 'No item'
            : data.count === 1
              ? `${data.count} item`
              : `${data.count} items`}
        </p>
        <p className="text-sm">{format(data.datetime, 'dd MMMM yyyy')}</p>
      </CardFooter>
    </Card>
  );
}

export function CardActions({ id }: { id: string }) {
  const router = useRouter();

  const linkTransctionModalStore = useLinkTransactionModal();

  const deleteMutation = useDeleteShoppingPlan(id);
  const isPending = deleteMutation.isPending;

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Plan',
    description: 'Just checking - are you sure you want to delete this plan?',
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 p-0" variant="ghost" disabled={isPending}>
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open row action</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => linkTransctionModalStore.onOpen(id)}>
            Create as transaction
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push(`/shopping-plans/${id}`);
            }}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
