'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  shoppingPlanSchema,
  InputShoppingPlanSchema,
  OutputShoppingPlanSchema,
} from '@/lib/zod/shopping-plan-schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/datetimepicker';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useShoppingPlanModal } from '@/hooks/zustand/use-shopping-plan-modal';
import {
  useCreateShoppingPlan,
  useGetShoppingPlan,
  useUpdateShoppingPlan,
} from '@/query/shopping-plans';

interface ShoppingPlanFormProps {
  isCreating: boolean;
}

export function ShoppingPlanForm({ isCreating }: ShoppingPlanFormProps) {
  const shoppingPlanModalStore = useShoppingPlanModal();

  const createMutation = useCreateShoppingPlan();
  const updateMutation = useUpdateShoppingPlan(shoppingPlanModalStore.id);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const shoppingPlanQuery = useGetShoppingPlan(shoppingPlanModalStore.id);
  const [shoppingPlanData] = shoppingPlanQuery.data || [];

  const defaultValues = shoppingPlanQuery.data
    ? {
        datetime: new Date(shoppingPlanData.datetime),
        title: shoppingPlanData.title ?? 'Untitled',
      }
    : {
        datetime: new Date(),
        title: 'Untitled',
      };

  // define form
  const { ...form } = useForm<
    InputShoppingPlanSchema,
    any,
    OutputShoppingPlanSchema
  >({
    resolver: zodResolver(shoppingPlanSchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputShoppingPlanSchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            shoppingPlanModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Creating shopping plan...',
          success: 'Shopping plan created successfully',
          error: 'Failed to create shopping plan',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            shoppingPlanModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating shopping plan...',
          success: 'Shopping plan updated successfully',
          error: 'Failed to update shopping plan',
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="flex items-center pt-4">
          <Button className="w-full" disabled={isPending}>
            {isCreating ? (
              <p>Create shopping plan</p>
            ) : (
              <p>Update shopping plan</p>
            )}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
