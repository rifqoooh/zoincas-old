import { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh min-w-fit flex-col">{children}</div>
  );
}
