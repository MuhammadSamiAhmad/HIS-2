import { SidebarItemProps } from "../types/types";
import { useSidebarStore } from "../store/sidebarStore";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isActive = false,
  path,
  onClick,
}) => {
  const { expanded } = useSidebarStore();

  const itemContent = (
    <>
      <img
        src={icon}
        alt={text}
        className="size-7 md:size-7 sm:size-5 text-callToAction-600"
      />
      <motion.p
        className={`
          ${isActive ? "text-callToAction" : "text-textColor"}
          ${expanded ? "block" : "hidden"}
          text-sm md:text-base
        `}
        initial={{ opacity: 1, width: "auto" }}
        animate={{
          opacity: expanded ? 1 : 0,
          width: expanded ? "auto" : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </>
  );

  const commonClasses = `
    flex flex-row items-center justify-start 
    px-2 md:px-3
    ${expanded ? "" : "mr-1 md:mr-3"} 
    py-1 gap-2 md:gap-4 rounded-lg cursor-pointer 
    transition-colors duration-200
    ${
      isActive
        ? "border-2 border-callToAction-600 bg-callToAction-200"
        : "border-Silver-2 hover:bg-gray-50"
    }
  `;

  if (path) {
    return (
      <Link to={path} className={commonClasses} onClick={onClick}>
        {itemContent}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={commonClasses}>
      {itemContent}
    </div>
  );
};
