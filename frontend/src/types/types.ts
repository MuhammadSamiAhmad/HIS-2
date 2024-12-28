export type SidebarState = {
  expanded: boolean;
  activeSection: string;
  toggleExpanded: () => void;
  setActiveSection: (section: string) => void;
  setExpanded: (value: boolean) => void;
};

export type SidebarProps = {
  role: "admin" | "doctor" | "patient"; // Role comes from the `User` type
};

export type SidebarItemProps = {
  icon: string; // The URL or path of the icon image
  text: string; // The text label of the sidebar item
  isActive?: boolean; // Optional flag to indicate if the item is active
  path?: string;
  onClick?: () => void; // Optional callback for click events
};

// types/types.ts
export type User = {
  id?: string;
  email: string;
  username: string;
  role: "patient" | "doctor" | "admin";
};
