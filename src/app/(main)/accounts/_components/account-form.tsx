'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertFromMiliunits } from '@/lib/utils';
import {
  accountSchema,
  InputAccountSchema,
  OutputAccountSchema,
} from '@/lib/zod/account-schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/currency-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAccountModal } from '@/hooks/zustand/use-account-modal';
import {
  useGetAccount,
  useCreateAccount,
  useUpdateAccount,
} from '@/query/accounts';

interface AccountFormProps {
  isCreating: boolean;
}

export function AccountForm({ isCreating }: AccountFormProps) {
  const accountModalStore = useAccountModal();

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount(accountModalStore.id);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const accountQuery = useGetAccount(accountModalStore.id);
  const [accountData] = accountQuery.data || [];

  const defaultValues = accountQuery.data
    ? {
        name: accountData.name,
        initialBalance: convertFromMiliunits(
          accountData.initialBalance
        ).toString(),
      }
    : {
        name: '',
        initialBalance: '',
      };

  // define form
  const { ...form } = useForm<InputAccountSchema, any, OutputAccountSchema>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputAccountSchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            accountModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Creating account...',
          success: 'Account created successfully',
          error: 'Failed to create account',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            accountModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating account...',
          success: 'Account updated successfully',
          error: 'Failed to update account',
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Account name"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="initialBalance"
          control={form.control}
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
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

        <footer className="grid pt-2">
          <Button disabled={isPending}>
            {isCreating ? <p>Create account</p> : <p>Update account</p>}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
