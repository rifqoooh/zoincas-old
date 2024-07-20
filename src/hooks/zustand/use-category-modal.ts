import { create } from 'zustand';

type categoryModalStore = {
  id?: string;
  isCreating: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenId: (id: string) => void;
  onClose: () => void;
};

export const useCategoryModal = create<categoryModalStore>((set) => ({
  id: undefined,
  isCreating: true,
  isOpen: false,
  onOpen: () => set({ id: undefined, isCreating: true, isOpen: true }),
  onOpenId: (id?: string) => set({ id: id, isCreating: false, isOpen: true }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
