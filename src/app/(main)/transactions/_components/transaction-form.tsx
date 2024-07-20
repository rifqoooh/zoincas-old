'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertFromMiliunits } from '@/lib/utils';
import {
  transactionSchema,
  InputTransactionSchema,
  OutputTransactionSchema,
} from '@/lib/zod/transaction-schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/datetimepicker';
import { CurrencyInput } from '@/components/currency-input';
import { AutoComplete } from '@/components/auto-complete';
import { AutoCompleteCategory } from './auto-complete-category';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useTransactionSheet } from '@/hooks/zustand/use-transaction-sheet';
import {
  useCreateTransaction,
  useGetTransaction,
  useUpdateTransaction,
} from '@/query/transactions';

interface TransactionFormProps {
  isCreating: boolean;
  accountsOptions: { label: string; value: string }[];
  categoriesOptions: { label: string; value: string }[];
}

export function TransactionForm({
  isCreating,
  accountsOptions,
  categoriesOptions,
}: TransactionFormProps) {
  const transactionSheetStore = useTransactionSheet();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction(transactionSheetStore.id);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const transactionQuery = useGetTransaction(transactionSheetStore.id);
  const [transactionData] = transactionQuery.data || [];

  const defaultValues = transactionQuery.data
    ? {
        datetime: new Date(transactionData.datetime),
        description: transactionData.description,
        amount: convertFromMiliunits(transactionData.amount).toString(),
        accountId: transactionData.accountId,
        categoryId: transactionData.categoryId,
      }
    : {
        datetime: new Date(),
        description: '',
        amount: '',
        accountId: '',
        categoryId: null,
      };

  // define form
  const { ...form } = useForm<
    InputTransactionSchema,
    any,
    OutputTransactionSchema
  >({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputTransactionSchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            transactionSheetStore.onClose();
          },
        }),
        {
          loading: 'Creating transaction...',
          success: 'Transaction created successfully',
          error: 'Failed to create transaction',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            transactionSheetStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating transaction...',
          success: 'Transaction updated successfully',
          error: 'Failed to update transaction',
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="datetime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datetime</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="minute"
                  showClearButton={false}
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                  isDisabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Monthly shopping"
                  disabled={isPending}
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
              <FormLabel>Category</FormLabel>
              <FormControl>
                <AutoCompleteCategory
                  {...field}
                  options={categoriesOptions}
                  placeholder="Select category"
                  isDisabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInput
                  {...field}
                  placeholder="0.00"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="accountId"
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
          <Button>
            {isCreating ? <p>Create transaction</p> : <p>Update transaction</p>}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
