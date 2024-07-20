import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { TransactionsTable } from './_components/transactions-table';
import {
  TransactionSheetProvider,
  TransactionSheetTrigger,
} from './_components/transaction-sheet';
import { ConnectBudgetModalProvider } from './_components/connect-budget-modal';

export default async function TransactionsPage() {
  return (
    <MaxWidthWrapper>
      <TransactionSheetProvider />
      <ConnectBudgetModalProvider />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Your transactions</CardTitle>
            <CardDescription>
              Check out all of transactions from every accounts.
            </CardDescription>
          </div>
          <TransactionSheetTrigger />
        </CardHeader>
        <CardContent>
          <TransactionsTable />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
