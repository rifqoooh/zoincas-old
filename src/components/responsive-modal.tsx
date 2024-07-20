'use client';

import { ReactNode } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ResponsiveModalProviderProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ResponsiveModalProvider({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ResponsiveModalProviderProps) {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={'bottom'} className="overflow-y-auto">
          <SheetHeader>
            {!!title && <SheetTitle>{title}</SheetTitle>}
            {!!description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
          <div className="pt-3">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          {!!title && <DialogTitle>{title}</DialogTitle>}
          {!!description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
