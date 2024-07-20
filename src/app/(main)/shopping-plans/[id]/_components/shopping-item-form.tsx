'use client';

import { useParams } from 'next/navigation';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateTotal, convertFromMiliunits } from '@/lib/utils';
import {
  shoppingItemSchema,
  InputShoppingItemSchema,
  OutputShoppingItemSchema,
} from '@/lib/zod/shopping-item-schema';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/number-input';
import { CurrencyInput } from '@/components/currency-input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  useCreateShoppingItem,
  useGetShoppingItem,
  useUpdateShoppingItem,
} from '@/query/shopping-items';
import { useShoppingItemSheet } from '@/hooks/zustand/use-shopping-item-sheet';

interface ShoppingItemFormProps {
  isCreating: boolean;
}

export function ShoppingItemForm({ isCreating }: ShoppingItemFormProps) {
  const params = useParams<{ id: string }>();

  const shoppingItemSheetStore = useShoppingItemSheet();

  const createMutation = useCreateShoppingItem(params.id);
  const updateMutation = useUpdateShoppingItem(shoppingItemSheetStore.id);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const shoppingItemQuery = useGetShoppingItem(shoppingItemSheetStore.id);
  const [shoppingItemData] = shoppingItemQuery.data || [];

  const defaultValues = shoppingItemQuery.data
    ? {
        name: shoppingItemData.name,
        amount: convertFromMiliunits(shoppingItemData.amount).toString(),
        quantity: shoppingItemData.quantity.toString(),
        discount: convertFromMiliunits(shoppingItemData.discount).toString(),
        tax: convertFromMiliunits(shoppingItemData.tax).toString(),
      }
    : {
        item: '',
        amount: '',
        quantity: '1',
        discount: '0',
        tax: '0',
      };

  // define form
  const { ...form } = useForm<
    InputShoppingItemSchema,
    any,
    OutputShoppingItemSchema
  >({
    resolver: zodResolver(shoppingItemSchema),
    defaultValues: defaultValues,
  });

  const [amount, quantity, discount, tax] = useWatch({
    control: form.control,
    name: ['amount', 'quantity', 'discount', 'tax'],
  });

  const total = calculateTotal({
    amount: parseFloat(amount),
    quantity: parseFloat(quantity),
    discount: parseFloat(discount),
    tax: parseFloat(tax),
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputShoppingItemSchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            shoppingItemSheetStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Creating item...',
          success: 'Item created successfully!',
          error: 'Failed to create item!',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            shoppingItemSheetStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating item...',
          success: 'Item updated successfully!',
          error: 'Failed to update item!',
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
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

        <FormField
          name="quantity"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>QTY.</FormLabel>
              <FormControl>
                <NumberInput {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="discount"
          control={form.control}
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <CurrencyInput {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="tax"
          control={form.control}
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>TAX</FormLabel>
              <FormControl>
                <CurrencyInput {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Total</FormLabel>
          <FormControl>
            <CurrencyInput value={total.toString()} disabled />
          </FormControl>
          <FormMessage />
        </FormItem>

        <footer className="flex items-center pt-4">
          <Button className="w-full" disabled={isPending}>
            {isCreating ? <p>Create item</p> : <p>Update item</p>}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
