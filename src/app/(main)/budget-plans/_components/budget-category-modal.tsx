'use client';

import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { useBudgetCategoryModal } from '@/hooks/zustand/use-budget-category-modal';
import { BudgetCategoryForm } from './budget-category-form';
import { MoreHorizontalIcon } from 'lucide-react';
import { useBudgetPlanModal } from '@/hooks/zustand/use-budget-plan-modal';
import { useGetBudgetCategory } from '@/query/budget-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteBudgetPlan } from '@/query/budget-plans';

export function BudgetCategoryModalProvider() {
  const budgetCategoryModalStore = useBudgetCategoryModal();

  const budgetCategoryQuery = useGetBudgetCategory(
    budgetCategoryModalStore.categoryId
  );

  const options = budgetCategoryModalStore.isCreating
    ? {
        title: 'Create Budget Plan Category',
        description: "Let's can make categories for your budget plan.",
      }
    : {
        title: 'Edit Budget Plan Category',
        description:
          'Wanna make some changes? Feel free to change the title of your budget plan category.',
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={budgetCategoryModalStore.isOpen}
      onClose={budgetCategoryModalStore.onClose}
    >
      {budgetCategoryQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
        </div>
      ) : (
        <BudgetCategoryForm isCreating={budgetCategoryModalStore.isCreating} />
      )}
    </ResponsiveModalProvider>
  );
}

export function CardActions({ id }: { id: string }) {
  const router = useRouter();

  const budgetPlanModalStore = useBudgetPlanModal();
  const budgetCategoryModalStore = useBudgetCategoryModal();

  const deleteMutation = useDeleteBudgetPlan(id);
  const isPending = deleteMutation.isPending;

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Plan',
    description:
      'Just checking - are you sure you want to delete this plan? This will delete category associated to this plan as well.',
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
          <DropdownMenuItem onClick={() => budgetCategoryModalStore.onOpen(id)}>
            Create new category
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push(`/budget-plans/${id}`);
            }}
          >
            View transactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => budgetPlanModalStore.onOpenId(id)}>
            Edit plan title
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete plan</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
