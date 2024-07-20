'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MenuIcon } from 'lucide-react';

export function MoblieNav({
  isUserSignedIn = false,
}: {
  isUserSignedIn?: boolean;
}) {
  const router = useRouter();

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(event) => event.stopPropagation()} asChild>
        <Button variant="ghost" size="sm">
          <MenuIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 font-medium"
        align="end"
        side="bottom"
        forceMount
      >
        {isUserSignedIn ? (
          <>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onClick('/login')}>
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClick('/signup')}>
              Sign up
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
