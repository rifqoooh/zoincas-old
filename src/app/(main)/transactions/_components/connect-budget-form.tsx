'use client';

import { useMemo } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  connectBudgetPlanSchema,
  InputConnectBudgetPlanSchema,
  OutputConnectBudgetPlanSchema,
} from '@/lib/zod/connect-budget-plan-schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AutoComplete } from '@/components/auto-complete';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useConnectBudgetModal } from '@/hooks/zustand/use-connect-budget-modal';
import {
  useGetTransactionBudget,
  useUpdateTransactionBudget,
} from '@/query/transactions';

interface ConnectBudgetFormProps {
  plansOptions: { label: string; value: string }[];
  planCategoriesData: {
    [key: string]: {
      id: string;
      categories: {
        value: string;
        label: string;
      }[];
    }[];
  };
}

export function ConnectBudgetForm({
  plansOptions,
  planCategoriesData,
}: ConnectBudgetFormProps) {
  const connectBudgetModalStore = useConnectBudgetModal();

  const updateMutation = useUpdateTransactionBudget(connectBudgetModalStore.id);
  const isPending = updateMutation.isPending;

  const transactionBudgetQuery = useGetTransactionBudget(
    connectBudgetModalStore.id
  );
  const [transactionBudgetData] = transactionBudgetQuery.data || [];

  const defaultValues = transactionBudgetData
    ? {
        planId: transactionBudgetData.planId,
        categoryId: transactionBudgetData.categoryId ?? '',
      }
    : {
        planId: '',
        categoryId: '',
      };

  // define form
  const { ...form } = useForm<
    InputConnectBudgetPlanSchema,
    any,
    OutputConnectBudgetPlanSchema
  >({
    resolver: zodResolver(connectBudgetPlanSchema),
    defaultValues: defaultValues,
  });

  const [planId] = useWatch({
    control: form.control,
    name: ['planId'],
  });

  const categoriesOptions = useMemo(
    () => planCategoriesData[planId]?.at(0)?.categories,
    [planId, planCategoriesData]
  );

  // define submit handler
  const onSubmit: SubmitHandler<OutputConnectBudgetPlanSchema> = async (
    values
  ) => {
    toast.promise(
      updateMutation.mutateAsync(values, {
        onSuccess: () => {
          connectBudgetModalStore.onClose();
        },
        onError: () => {
          form.reset();
        },
      }),
      {
        loading: 'Linking to budget...',
        success: 'Transaction linked to budget successfully.',
        error: 'Failed to link to budget',
      }
    );
  };

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="planId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Plan</FormLabel>
              <FormControl>
                <AutoComplete
                  {...field}
                  options={plansOptions}
                  placeholder="Select budget plan"
                  emptyMessage="No results."
                  isDisabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Category</FormLabel>
              <FormControl>
                <AutoComplete
                  {...field}
                  options={categoriesOptions || []}
                  placeholder="Select budget category"
                  emptyMessage="No results."
                  isDisabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="grid pt-2">
          <Button>Connect</Button>
        </footer>
      </form>
    </Form>
  );
}
