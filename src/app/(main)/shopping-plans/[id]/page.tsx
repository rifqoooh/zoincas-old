import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingPlanSheetProvider } from '../_components/shopping-plan-sheet';
import { ShoppingPlanItemSheetProvider } from './_components/shopping-item-sheet';
import { ShoppingPlanCardHeader } from './_components/card-header';
import { ShoppingPlanTable } from './_components/shopping-table';

interface ShoppingPlanIdPageProps {
  params: {
    id: string;
  };
}

export default function ShoppingPlanIdPage({
  params,
}: ShoppingPlanIdPageProps) {
  return (
    <MaxWidthWrapper>
      <ShoppingPlanSheetProvider />
      <ShoppingPlanItemSheetProvider />
      <Card>
        <ShoppingPlanCardHeader id={params.id} />
        <CardContent>
          <ShoppingPlanTable id={params.id} />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
