'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  budgetPlanSchema,
  InputBudgetPlanSchema,
  OutputBudgetPlanSchema,
} from '@/lib/zod/budget-plan-schema';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useBudgetPlanModal } from '@/hooks/zustand/use-budget-plan-modal';
import {
  useCreateBudgetPlan,
  useGetBudgetPlan,
  useUpdateBudgetPlan,
} from '@/query/budget-plans';

interface BudgetPlanFormProps {
  isCreating: boolean;
}

export function BudgetPlanForm({ isCreating }: BudgetPlanFormProps) {
  const budgetPlanModalStore = useBudgetPlanModal();

  const createMutation = useCreateBudgetPlan();
  const updateMutation = useUpdateBudgetPlan(budgetPlanModalStore.id);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const budgetPlanQuery = useGetBudgetPlan(budgetPlanModalStore.id);
  const [budgetPlanData] = budgetPlanQuery.data || [];

  const defaultValues = budgetPlanQuery.data
    ? {
        title: budgetPlanData.title ?? 'Untitled',
      }
    : {
        title: 'Untitled',
      };

  // define form
  const { ...form } = useForm<
    InputBudgetPlanSchema,
    any,
    OutputBudgetPlanSchema
  >({
    resolver: zodResolver(budgetPlanSchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputBudgetPlanSchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            budgetPlanModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Creating budget plan...',
          success: 'Budget plan created successfully',
          error: 'Failed to create budget plan',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            budgetPlanModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating budget plan...',
          success: 'Budget plan updated successfully',
          error: 'Failed to update budget plan',
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            {isCreating ? <p>Create budget plan</p> : <p>Update budget plan</p>}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
