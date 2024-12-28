import { Outlet } from "react-router-dom";
import BackgroundImage from "../assets/images/BackgroundImage.svg";

export const AuthenticationLayout = () => {
  return (
    <div
      className="flex m-0 p-0 h-screen w-scree bg-contain bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Left Section: Image */}
      <div className="hidden md:block w-2/3"></div>

      {/* Right Section: Authentication Pages */}
      <div className="w-full md:w-1/3 flex flex-col p-5 items-center bg-background rounded-none shadow-none md:rounded-tl-[20px] md:rounded-bl-[20px] md:shadow-[0_-50px_80px_10px_rgba(0,0,0,0.7)]">
        <Outlet /> {/* Renders SignInPage or SignUpPage based on the route */}
      </div>
    </div>
  );
};
