import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { SummaryGrid } from './_components/summary-grid';

export default async function DashboardPage() {
  return (
    <MaxWidthWrapper>
      <main>
        <SummaryGrid />
      </main>
    </MaxWidthWrapper>
  );
}
