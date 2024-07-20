import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { ShoppingPlanSheetProvider } from './_components/shopping-plan-sheet';
import { LinkTransactionModalProvider } from './_components/link-transaction-modal';
import { ShoppingPlanCards } from './_components/shopping-plan-cards';

export default function ShoppingPlansPage() {
  return (
    <MaxWidthWrapper>
      <ShoppingPlanSheetProvider />
      <LinkTransactionModalProvider />
      <main className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ShoppingPlanCards />
      </main>
    </MaxWidthWrapper>
  );
}
