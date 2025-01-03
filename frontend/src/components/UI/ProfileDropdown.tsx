import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DropdownArrow from "../../assets/images/DropdownArrow.svg";
import AccountIcon from "../../assets/images/user-circle-single--circle-geometric-human-person-single-user.svg";
import Logout from "../../assets/images/logout.svg";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../../store/sidebarStore";

export const ProfileDropdown: React.FC = () => {
  const { setActiveSection } = useSidebarStore(); // Import the setActiveSection action

  const navigate = useNavigate();
  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="outline-none">
          <button
            className="items-center justify-center "
            aria-label="Profile-Dropdown"
          >
            <img src={DropdownArrow} alt="dropdown-arrow" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-fit w-[200px] rounded-md bg-white p-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] flex flex-col gap-2 mt-2 mr-10"
            sideOffset={5}
          >
            <DropdownMenu.Item
              onClick={() => {
                navigate("/account");
                setActiveSection("Account Settings");
              }}
              className="flex flex-row items-center justify-start gap-5 outline-none hover:cursor-pointer"
            >
              <img src={AccountIcon} />
              Account
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="m-[5px] h-px bg-Silver-2" />
            <DropdownMenu.Item
              onClick={() => {
                navigate("/");
              }}
              className="flex flex-row items-center justify-start gap-5 outline-none hover:cursor-pointer"
            >
              <img src={Logout} />
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
