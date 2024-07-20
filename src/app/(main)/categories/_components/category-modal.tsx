'use client';

import { PlusCircleIcon } from 'lucide-react';
import { useIsClient } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveModalProvider } from '@/components/responsive-modal';
import { CategoryForm } from './category-form';
import { useCategoryModal } from '@/hooks/zustand/use-category-modal';
import { useGetCategory } from '@/query/categories';

export function CategoryModalProvider() {
  const categoryModalStore = useCategoryModal();
  const categoryQuery = useGetCategory(categoryModalStore.id);

  const isClient = useIsClient();
  if (!isClient) return null;

  const options = categoryModalStore.isCreating
    ? {
        title: 'Create Category',
        description:
          "Ready to take charge of your expenses? Let's create a new category together!",
      }
    : {
        title: 'Edit Category',
        description:
          "Let's make some changes! Feel free to update your category description to better suit you.",
      };

  return (
    <ResponsiveModalProvider
      title={options.title}
      description={options.description}
      isOpen={categoryModalStore.isOpen}
      onClose={categoryModalStore.onClose}
    >
      {categoryQuery.isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-14 w-full bg-slate-200" />
          <Skeleton className="h-10 w-28 bg-slate-200" />
        </div>
      ) : (
        <CategoryForm isCreating={categoryModalStore.isCreating} />
      )}
    </ResponsiveModalProvider>
  );
}

export function CategoryModalTrigger() {
  const categoryModalStore = useCategoryModal();

  return (
    <Button
      onClick={categoryModalStore.onOpen}
      className="'rounded-lg shadow-sm' h-full border-2 border-dashed bg-transparent text-card-foreground hover:bg-slate-100"
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground md:flex-col md:gap-1 md:pt-1">
          <PlusCircleIcon className="size-4 md:size-7" />
          <p>Create new category</p>
        </div>
      </CardContent>
    </Button>
  );
}
