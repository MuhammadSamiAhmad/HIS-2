import { useSidebarStore } from "../store/sidebarStore";

export const SectionTitle: React.FC = () => {
  const activeSection = useSidebarStore((state) => state.activeSection);

  return (
    <div className="text-textColor font-bold lg:text-3xl">{activeSection}</div>
  );
};
