import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { AccountModalProvider } from '../_components/account-modal';
import AccountTransactionsTable from './_components/account-transactions-table';
import { TransactionSheetProvider } from '../../transactions/_components/transaction-sheet';
import { AccountCardHeader } from './_components/card-header';

interface AccountIdPageProps {
  params: {
    id: string;
  };
}

export default function AccountIdPage({ params }: AccountIdPageProps) {
  return (
    <MaxWidthWrapper>
      <AccountModalProvider />
      <TransactionSheetProvider />
      <Card>
        <AccountCardHeader id={params.id} />
        <CardContent>
          <AccountTransactionsTable id={params.id} />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
