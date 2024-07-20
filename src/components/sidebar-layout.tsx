'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { cn } from '@/lib/utils';
import { actionSignOut } from '@/server/auth';
import { ChevronsLeftIcon, ChevronsRightIcon, MenuIcon } from 'lucide-react';
import { navRoutes } from '@/const';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './ui/select';
import { useGetUser } from '@/query/users';
import { useGetAccounts } from '@/query/accounts';
import { useGetSummary } from '@/query/summary';

export function SidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const userQuery = useGetUser();
  const [userData] = userQuery.data || [];

  return (
    <div className="flex min-h-svh w-full flex-col">
      {/* sidebar content */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col overflow-y-auto overflow-x-hidden bg-slate-50 max-lg:-z-10 max-lg:w-0',
          {
            'z-10 w-64 transition-all duration-300 ease-in-out': isSidebarOpen,
          },
          {
            '-z-10 w-0 transition-all duration-300 ease-in-out': !isSidebarOpen,
          }
        )}
      >
        <div className="flex flex-col gap-2 py-3">
          {/* sidebar header */}
          <div className="sticky inset-0 flex h-14 items-center bg-slate-50 px-6">
            <h1 className="text-xl font-semibold">zoincas</h1>
          </div>

          {/* sidenar menu items */}
          <div className="flex-1">
            <SidebarItems />
          </div>
        </div>
      </aside>

      {/* main content */}
      <main
        className={cn(
          'max-lg:pl-0',
          { 'pl-64 transition-all duration-300 ease-in-out': isSidebarOpen },
          { 'pl-0 transition-all duration-300 ease-in-out': !isSidebarOpen }
        )}
      >
        <div className="flex flex-col gap-4 bg-slate-50">
          <header className="sticky inset-0 z-10 bg-slate-50 px-2 pt-2">
            <div className="flex h-14 items-center gap-4 rounded-lg bg-primary pl-4 pr-3">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 lg:hidden"
                  >
                    <MenuIcon className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-slate-50 px-2">
                  <MenuItems onClose={() => setIsMenuOpen(false)} />
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="icon"
                className="size-8 max-lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <ChevronsLeftIcon className="size-4" />
                ) : (
                  <ChevronsRightIcon className="size-4" />
                )}

                <span className="sr-only">Toggle sidebar</span>
              </Button>

              <h1 className="grow text-lg font-semibold text-white">
                {userQuery.isLoading
                  ? 'Welcome back'
                  : `Welcome back, ${userData.username}`}
              </h1>

              {pathname === '/dashboard' && <AccountFilter />}
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export function MenuItems({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const onSingOut = async () => {
    toast.promise(async () => await actionSignOut(), {
      loading: 'Logging out...',
      success: 'Logged out successfully',
      error: 'Failed to log out',
    });

    onClose();
  };

  const onClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <nav className="grid items-start gap-1 px-2 pt-6 text-sm font-medium">
      {navRoutes.map(({ label, href, icon: Icon }) => (
        <Button
          key={label}
          variant={pathname.startsWith(href) ? 'default' : 'ghost'}
          size="sm"
          className={cn('justify-start gap-3', {
            'text-muted-foreground hover:bg-slate-200':
              !pathname.startsWith(href),
          })}
          onClick={() => onClick(href)}
        >
          <Icon className="size-4 shrink-0" />
          <p className="shrink-0">{label}</p>
        </Button>
      ))}

      <Separator />

      {/* log out */}
      <Button
        variant={'ghost'}
        size="sm"
        className="justify-start gap-3 text-muted-foreground hover:bg-slate-200"
        onClick={onSingOut}
      >
        Log out
      </Button>
    </nav>
  );
}

export function SidebarItems() {
  const pathname = usePathname();

  const onSingOut = async () => {
    toast.promise(async () => await actionSignOut(), {
      loading: 'Logging out...',
      success: 'Logged out successfully',
      error: 'Failed to log out',
    });
  };

  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium">
      {navRoutes.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            buttonVariants({
              variant: pathname.startsWith(href) ? 'default' : 'ghost',
              size: 'sm',
            }),
            'justify-start gap-3',
            {
              'text-muted-foreground hover:bg-slate-200':
                !pathname.startsWith(href),
            }
          )}
        >
          <Icon className="size-4 shrink-0" />
          <p className="shrink-0">{label}</p>
        </Link>
      ))}

      <Separator />

      {/* log out */}
      <Link
        href={'/'}
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'sm',
          }),
          'justify-start gap-3 text-muted-foreground hover:bg-slate-200'
        )}
        onClick={onSingOut}
      >
        Log out
      </Link>
    </nav>
  );
}

export function AccountFilter() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId') || 'all';

  const accountsQuery = useGetAccounts();
  const accountsData = accountsQuery.data || [];

  const summaryQuery = useGetSummary();

  const isPending = accountsQuery.isLoading || summaryQuery.isLoading;

  const onChange = (value: string) => {
    const query = {
      accountId: value,
    };

    if (value === 'all') {
      query.accountId = '';
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select value={accountId} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className="h-9 w-auto gap-5 border-none bg-background/40 text-white hover:bg-background/30">
        <SelectValue placeholder="Accounts" />
      </SelectTrigger>
      <SelectContent align="end" sideOffset={4} alignOffset={-1}>
        <SelectItem value="all">All accounts</SelectItem>
        {accountsData.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
