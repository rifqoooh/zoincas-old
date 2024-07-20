'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useBudgetCategoryModal } from '@/hooks/zustand/use-budget-category-modal';
import {
  budgetCategorySchema,
  InputBudgetCategorySchema,
  OutputBudgetCategorySchema,
} from '@/lib/zod/budget-category-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  useGetBudgetCategory,
  useCreateBudgetCategory,
  useUpdateBudgetCategory,
  useDeleteBudgetCategory,
} from '@/query/budget-categories';
import { CurrencyInput } from '@/components/currency-input';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { convertFromMiliunits } from '@/lib/utils';

interface BudgetCategoryFormProps {
  isCreating: boolean;
}

export function BudgetCategoryForm({ isCreating }: BudgetCategoryFormProps) {
  const budgetCategoryModalStore = useBudgetCategoryModal();

  const createMutation = useCreateBudgetCategory(
    budgetCategoryModalStore.planId
  );
  const updateMutation = useUpdateBudgetCategory(
    budgetCategoryModalStore.categoryId
  );
  const deleteMutation = useDeleteBudgetCategory(
    budgetCategoryModalStore.categoryId
  );

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Category',
    description:
      'Just checking - are you sure you want to delete this category?',
  });

  const budgetCategoryQuery = useGetBudgetCategory(
    budgetCategoryModalStore.categoryId
  );
  const [budgetCategoryData] = budgetCategoryQuery.data || [];

  const defaultValues = budgetCategoryQuery.data
    ? {
        name: budgetCategoryData.name,
        amount: convertFromMiliunits(budgetCategoryData.amount).toString(),
      }
    : {
        name: 'Uncategorized',
        amount: '',
      };

  // define form
  const { ...form } = useForm<
    InputBudgetCategorySchema,
    any,
    OutputBudgetCategorySchema
  >({
    resolver: zodResolver(budgetCategorySchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputBudgetCategorySchema> = async (
    values
  ) => {
    if (isCreating) {
      createMutation.mutate(values, {
        onSuccess: () => {
          budgetCategoryModalStore.onClose();
        },
        onError: () => {
          form.reset();
        },
      });
    } else {
      updateMutation.mutate(values, {
        onSuccess: () => {
          budgetCategoryModalStore.onClose();
        },
        onError: () => {
          form.reset();
        },
      });
    }
  };

  // define delete handler
  const onDelete = async () => {
    const isConfirm = await confirm();
    if (isConfirm) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          budgetCategoryModalStore.onClose();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <ConfirmDialog />
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInput {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="flex flex-col items-center gap-2 pt-4">
          <Button className="w-full" disabled={isPending}>
            {isCreating ? <p>Create category</p> : <p>Update category</p>}
          </Button>
          {!isCreating && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onDelete}
              disabled={isPending}
            >
              <p>Delete category</p>
            </Button>
          )}
        </footer>
      </form>
    </Form>
  );
}
