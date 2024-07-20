import { create } from 'zustand';

type connectBudgetModalStore = {
  id?: string;
  isConnecting: boolean;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useConnectBudgetModal = create<connectBudgetModalStore>((set) => ({
  id: undefined,
  isConnecting: true,
  isOpen: false,
  onOpen: (id?: string) =>
    set({
      id: id,
      isConnecting: true,
      isOpen: true,
    }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
