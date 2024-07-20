'use client';

import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { MoreHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CategoryModalTrigger } from './category-modal';
import { useCategoryModal } from '@/hooks/zustand/use-category-modal';
import { cn, convertFromMiliunits, formatCurrency } from '@/lib/utils';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useDeleteCategory, useGetCategories } from '@/query/categories';
import { categories } from '@/lib/supabase/schema';

const selectSchema = createSelectSchema(categories)
  .omit({
    userId: true,
    createdAt: true,
  })
  .extend({
    count: z.number(),
    total: z.number(),
  });

interface CategoryCardProps {
  data: z.infer<typeof selectSchema>;
}

export function CategoryCards() {
  const categoriesQuery = useGetCategories();
  const categoriesData = categoriesQuery.data || [];

  if (categoriesQuery.isLoading) {
    return (
      <>
        <Skeleton className="h-52 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
        <Skeleton className="h-52 bg-slate-200" />
      </>
    );
  }

  return (
    <>
      {categoriesData.map((category) => (
        <CategoryCard key={category.id} data={category} />
      ))}
      <CategoryModalTrigger />
    </>
  );
}

export function CategoryCard({ data }: CategoryCardProps) {
  const isPositiveNum = data.total >= 0;

  return (
    <Card className="bg-gradient-to-tr from-white to-slate-50">
      <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-4">
        <CardActions id={data.id} />
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-xl">{data.name}</CardTitle>
        <CardDescription
          className={cn(
            { 'text-green-500': isPositiveNum },
            { 'text-red-500': !isPositiveNum }
          )}
        >
          {formatCurrency(convertFromMiliunits(data.total))}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <p className="text-sm">{`${data.count} transactions`}</p>
      </CardFooter>
    </Card>
  );
}

export function CardActions({ id }: { id: string }) {
  const categoryModalStore = useCategoryModal();

  const deleteMutation = useDeleteCategory(id);
  const isPending = deleteMutation.isPending;

  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: 'Delete Category',
    description:
      'Just checking - are you sure you want to delete this category? All transactions related to this category will be set as uncategorized.',
  });

  const onDelete = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      toast.promise(deleteMutation.mutateAsync(), {
        loading: 'Deleting category...',
        success: 'Category deleted successfully',
        error: 'Failed to delete category',
      });
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
          <DropdownMenuItem onClick={() => categoryModalStore.onOpenId(id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
