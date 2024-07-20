'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  InputLinkShoppingPlanSchema,
  OutputLinkShoppingPlanSchema,
  linkShoppingPlanSchema,
} from '@/lib/zod/link-shopping-plan-schema';
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
import { useLinkTransactionModal } from '@/hooks/zustand/use-link-transaction-modal';
import {
  useCreateTransactionShopping,
  useGetTransactionShopping,
  useUpdateTransactionShopping,
} from '@/query/transactions';

interface LinkTransactionFormProps {
  accountsOptions: { label: string; value: string }[];
}

export function LinkTransactionForm({
  accountsOptions,
}: LinkTransactionFormProps) {
  const linkTransctionModalStore = useLinkTransactionModal();

  // create mutation
  const createMutation = useCreateTransactionShopping(
    linkTransctionModalStore.id
  );

  // update mutation
  const updateMutation = useUpdateTransactionShopping(
    linkTransctionModalStore.id
  );

  const isPending = updateMutation.isPending || createMutation.isPending;

  const transactionShoppingQuery = useGetTransactionShopping(
    linkTransctionModalStore.id
  );
  const [transactionShoppingData] = transactionShoppingQuery.data || [];

  const defaultValues = transactionShoppingData
    ? {
        planId: transactionShoppingData.accountId ?? '',
      }
    : {
        planId: '',
      };

  // define form
  const { ...form } = useForm<
    InputLinkShoppingPlanSchema,
    any,
    OutputLinkShoppingPlanSchema
  >({
    resolver: zodResolver(linkShoppingPlanSchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputLinkShoppingPlanSchema> = async (
    values
  ) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        linkTransctionModalStore.onClose();
      },
      onError: () => {
        form.reset();
      },
    });

    return console.log(values);

    updateMutation.mutate(values, {
      onSuccess: () => {
        linkTransctionModalStore.onClose();
      },
      onError: () => {
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="planId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <AutoComplete
                  {...field}
                  options={accountsOptions}
                  placeholder="Select account"
                  emptyMessage="No results."
                  isDisabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="grid pt-2">
          <Button>Create transaction</Button>
        </footer>
      </form>
    </Form>
  );
}
