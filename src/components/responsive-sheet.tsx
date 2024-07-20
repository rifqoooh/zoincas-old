import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ResponsiveSheetProviderProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ResponsiveSheetProvider({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ResponsiveSheetProviderProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          {!!title && <SheetTitle>{title}</SheetTitle>}
          {!!description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="pt-3">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
