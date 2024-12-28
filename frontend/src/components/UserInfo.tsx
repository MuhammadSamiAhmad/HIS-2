import NotificationIcon from "../assets/images/notification.svg";
import { Avatar } from "./UI/Avatar";
import { ProfileDropdown } from "./UI/ProfileDropdown";

export const UserInfo: React.FC = () => {
  return (
    <div id="user-info" className="flex flex-row gap-4">
      <img
        src={NotificationIcon}
        className="bg-callToAction-500 rounded-full p-2 size-11 mt-0.5 hover:cursor-pointer hover:bg-callToAction-700"
      />
      <div className="flex flex-row items-center justify-center border-l-2 px-4 gap-4">
        <Avatar />
        <div id="name-title" className="flex flex-col text-left mr-8">
          <h1 className="font-bold hover:cursor-default">Patient Name</h1>
          <p className="text-Silver-1 hover:cursor-default">Patient</p>
        </div>
        <ProfileDropdown />
      </div>
    </div>
  );
};
