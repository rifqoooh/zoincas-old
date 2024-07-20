import { create } from 'zustand';

type SidebarStore = {
  isOpen: boolean;
  onClose: () => void;
  toggleIsOpen: () => void;
  isCollapse: boolean;
  toggleIsCollapse: () => void;
};

export const useSidebar = create<SidebarStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  toggleIsOpen: () => set({ isOpen: !get().isOpen }),
  isCollapse: true,
  toggleIsCollapse: () => set({ isCollapse: !get().isCollapse }),
}));
