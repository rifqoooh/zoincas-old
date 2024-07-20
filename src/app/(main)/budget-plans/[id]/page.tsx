import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetPlanCardHeader } from './_components/card-header';
import { BudgetPlanTable } from './_components/budget-plan-table';
import { BudgetPlanModalProvider } from '../_components/budget-plan-modal';
import { BudgetCategoryModalProvider } from '../_components/budget-category-modal';

interface BudgetPlanIdPageProps {
  params: {
    id: string;
  };
}

export default function BudgetPlanIdPage({ params }: BudgetPlanIdPageProps) {
  return (
    <MaxWidthWrapper>
      <BudgetPlanModalProvider />
      <BudgetCategoryModalProvider />
      <Card>
        <BudgetPlanCardHeader id={params.id} />
        <CardContent>
          <BudgetPlanTable id={params.id} />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
