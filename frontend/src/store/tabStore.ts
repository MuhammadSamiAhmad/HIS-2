import { create } from "zustand";
import { TabData } from "../types/types";

type TabsStore = {
  tabs: TabData[];
  setTabs: (tabs: TabData[]) => void;
};

export const useTabsStore = create<TabsStore>((set) => ({
  tabs: [],
  setTabs: (tabs) => set({ tabs }),
}));
