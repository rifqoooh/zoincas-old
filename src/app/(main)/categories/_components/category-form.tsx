'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  categorySchema,
  InputCategorySchema,
  OutputCategorySchema,
} from '@/lib/zod/category-schema';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCategoryModal } from '@/hooks/zustand/use-category-modal';
import {
  useGetCategory,
  useCreateCategory,
  useUpdateCategory,
} from '@/query/categories';

interface CategoryFormProps {
  isCreating: boolean;
}

export function CategoryForm({ isCreating }: CategoryFormProps) {
  const categoryModalStore = useCategoryModal();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(categoryModalStore.id);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const categoryQuery = useGetCategory(categoryModalStore.id);
  const [categoryData] = categoryQuery.data || [];

  const defaultValues = categoryQuery.data
    ? {
        name: categoryData.name,
      }
    : {
        name: '',
      };

  // define form
  const { ...form } = useForm<InputCategorySchema, any, OutputCategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  });

  // define submit handler
  const onSubmit: SubmitHandler<OutputCategorySchema> = async (values) => {
    if (isCreating) {
      toast.promise(
        createMutation.mutateAsync(values, {
          onSuccess: () => {
            categoryModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Creating category...',
          success: 'Category created successfully',
          error: 'Failed to create category',
        }
      );
    } else {
      toast.promise(
        updateMutation.mutateAsync(values, {
          onSuccess: () => {
            categoryModalStore.onClose();
          },
          onError: () => {
            form.reset();
          },
        }),
        {
          loading: 'Updating category...',
          success: 'Category updated successfully',
          error: 'Failed to update category',
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
                  placeholder="Category name"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="grid pt-2">
          <Button disabled={isPending}>
            {isCreating ? <p>Create category</p> : <p>Update category</p>}
          </Button>
        </footer>
      </form>
    </Form>
  );
}
