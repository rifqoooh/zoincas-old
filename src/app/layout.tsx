import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';

const font = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'zoincas',
  description: 'Save more your monthly cashflow',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'relative h-full bg-slate-50 text-black antialiased',
          font.className
        )}
      >
        <QueryProvider>
          <Toaster position="bottom-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
