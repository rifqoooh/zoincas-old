import { create } from 'zustand';

type budgetPlanModalStore = {
  id?: string;
  isCreating: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenId: (id: string) => void;
  onClose: () => void;
};

export const useBudgetPlanModal = create<budgetPlanModalStore>((set) => ({
  id: undefined,
  isCreating: true,
  isOpen: false,
  onOpen: () => set({ id: undefined, isCreating: true, isOpen: true }),
  onOpenId: (id?: string) => set({ id: id, isCreating: false, isOpen: true }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
