import { create } from 'zustand';

type transactionSheetStore = {
  id?: string;
  isCreating: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenId: (id: string) => void;
  onClose: () => void;
};

export const useTransactionSheet = create<transactionSheetStore>((set) => ({
  id: undefined,
  isCreating: true,
  isOpen: false,
  onOpen: () => set({ id: undefined, isCreating: true, isOpen: true }),
  onOpenId: (id?: string) => set({ id: id, isCreating: false, isOpen: true }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
