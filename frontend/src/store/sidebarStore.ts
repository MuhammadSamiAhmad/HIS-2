import { create } from "zustand";
import { SidebarState } from "../types/types";

export const useSidebarStore = create<SidebarState>((set) => ({
  expanded: true,
  activeSection: "Reservations", // Default value
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
  setActiveSection: (section) => set({ activeSection: section }),
  setExpanded: (value: boolean) => set({ expanded: value }),
}));
