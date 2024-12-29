import NotificationIcon from "../assets/images/notification.svg";
import { Avatar } from "./UI/Avatar";
import { ProfileDropdown } from "./UI/ProfileDropdown";
import { useAuthStore } from "../store/authStore"; // Assuming user data is in authStore

export const UserInfo: React.FC = () => {
  const { currentUser } = useAuthStore(); // Get authenticated user info

  if (!currentUser) {
    return null; // Optionally handle unauthenticated state
  }

  return (
    <div id="user-info" className="flex flex-row gap-4">
      {currentUser.role === "admin" && (
        <img
          src={NotificationIcon}
          alt="Notification Icon"
          className="bg-callToAction-500 rounded-full p-2 size-11 mt-0.5 hover:cursor-pointer hover:bg-callToAction-700"
        />
      )}
      <div className="flex flex-row items-center justify-center border-l-2 px-4 gap-4">
        <Avatar
          profileImage={currentUser.profileImage}
          username={currentUser.username}
        />{" "}
        {/* Pass profile image */}
        <div id="name-title" className="flex flex-col text-left mr-8">
          <h1 className="font-bold hover:cursor-default">
            {currentUser.username}
          </h1>
          <p className="text-Silver-1 hover:cursor-default">
            {currentUser.role}
          </p>
        </div>
        <ProfileDropdown />
      </div>
    </div>
  );
};
