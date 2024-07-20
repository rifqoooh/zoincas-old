import { create } from 'zustand';

type linkTransctionModalStore = {
  id?: string;
  isLinking: boolean;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useLinkTransactionModal = create<linkTransctionModalStore>(
  (set) => ({
    id: undefined,
    isLinking: true,
    isOpen: false,
    onOpen: (id?: string) => set({ id, isLinking: true, isOpen: true }),
    onClose: () => set({ id: undefined, isOpen: false }),
  })
);
