import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SectionTitle } from "./SectionTitle";
import { UserInfo } from "./UserInfo";
import { useAuthStore } from "../store/authStore"; // Import auth store

export const SystemLayout: React.FC = () => {
  // Get the `currentUser` from the auth store
  const { currentUser } = useAuthStore();
  const role = currentUser?.role || "patient"; // Default to "patient" if no role
  return (
    <div
      id="main-section"
      className="w-screen h-screen bg-background flex flex-row font-manrope text-textColor overflow-y-hidden"
    >
      <Sidebar role={role} />
      <div id="right-section" className="bg-background flex flex-col w-full">
        <div className="bg-background mb-5 h-[10%] p-10 flex flex-row justify-between items-center">
          <SectionTitle />
          <UserInfo />
        </div>
        <div className="bg-background h-[90%] p-10 border-t-2 border-Silver-2 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
