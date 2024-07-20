import { create } from 'zustand';

type budgetCategoryModalStore = {
  planId?: string;
  categoryId?: string;
  isCreating: boolean;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onOpenId: (id: string) => void;
  onClose: () => void;
};

export const useBudgetCategoryModal = create<budgetCategoryModalStore>(
  (set) => ({
    id: undefined,
    isCreating: true,
    isOpen: false,
    onOpen: (id?: string) =>
      set({ planId: id, isCreating: true, isOpen: true }),
    onOpenId: (id?: string) =>
      set({ categoryId: id, isCreating: false, isOpen: true }),
    onClose: () =>
      set({ planId: undefined, categoryId: undefined, isOpen: false }),
  })
);
