import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { CategoryModalProvider } from './_components/category-modal';
import { CategoryCards } from './_components/category-cards';

export default function CategoriesPage() {
  return (
    <MaxWidthWrapper>
      <CategoryModalProvider />
      <main className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CategoryCards />
      </main>
    </MaxWidthWrapper>
  );
}
