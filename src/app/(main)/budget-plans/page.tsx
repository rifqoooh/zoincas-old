import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { BudgetPlanCards } from './_components/budget-plan-cards';
import { BudgetPlanModalProvider } from './_components/budget-plan-modal';
import { BudgetCategoryModalProvider } from './_components/budget-category-modal';

export default function BudgetPlansPage() {
  return (
    <MaxWidthWrapper>
      <BudgetPlanModalProvider />
      <BudgetCategoryModalProvider />
      <main className="grid gap-4">
        <BudgetPlanCards />
      </main>
    </MaxWidthWrapper>
  );
}
