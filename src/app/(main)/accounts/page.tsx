import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { AccountModalProvider } from './_components/account-modal';
import { AccountCards } from './_components/account-cards';

export default function AccountsPage() {
  return (
    <MaxWidthWrapper>
      <AccountModalProvider />
      <main className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AccountCards />
      </main>
    </MaxWidthWrapper>
  );
}
