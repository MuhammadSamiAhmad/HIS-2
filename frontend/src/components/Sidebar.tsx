import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSidebarStore } from "../store/sidebarStore";
import ArrowLeft from "../assets/images/arrow-left.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import Logo from "../assets/images/Logo.svg";
import Hospital from "../assets/images/hospital.svg";
import Reservations from "../assets/images/calendar-tick.svg";
import MedicalRecords from "../assets/images/patients.svg";
import Invoices from "../assets/images/receipt--shop-shopping-pay-payment-store-cash-bill-receipt.svg";
import Support from "../assets/images/customer-support-1--customer-headset-help-microphone-phone-support.svg";
import DashboardIcon from "../assets/images/dashboard-3--app-application-dashboard-home-layout-vertical.svg";
import { SidebarItem } from "./SidebarItem";
import { SidebarProps } from "../types/types";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate(); // For navigation
  const { expanded, toggleExpanded, setActiveSection, setExpanded } =
    useSidebarStore();
  const [activeItem, setActiveItem] = useState<string>("");

  // Sidebar items based on roles with paths
  const items =
    role === "admin"
      ? [
          {
            id: "dashboard",
            icon: DashboardIcon,
            text: "Dashboard",
            path: "/admin-dashboard",
          },
          {
            id: "reservations",
            icon: Reservations,
            text: "Reservations",
            path: "/admin-reservations",
          },
          {
            id: "patients",
            icon: MedicalRecords,
            text: "Patients",
            path: "/admin-patients",
          },
          {
            id: "doctors",
            icon: MedicalRecords,
            text: "Doctors",
            path: "/admin-doctors",
          },
          {
            id: "inventory",
            icon: MedicalRecords,
            text: "Inventory",
            path: "/inventory",
          },
        ]
      : role === "doctor"
      ? [
          {
            id: "reservations",
            icon: Reservations,
            text: "Reservations",
            path: "/doctor-reservations",
          },
          {
            id: "patients",
            icon: MedicalRecords,
            text: "Patients",
            path: "/doctor-patients",
          },
        ]
      : [
          {
            id: "reservations",
            icon: Reservations,
            text: "Reservations",
            path: "/patient-reservations",
          },
          {
            id: "medical-record",
            icon: MedicalRecords,
            text: "Medical Record",
            path: "/patient-medicalrecord",
          },
          {
            id: "invoices",
            icon: Invoices,
            text: "Invoices",
            path: "/patient-invoices",
          },
        ];
  // Handler for sidebar item clicks
  const handleItemClick = (id: string, text: string, path: string) => {
    setActiveItem(id);
    setActiveSection(text);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 768px is typical md breakpoint
        setExpanded(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setExpanded]);

  // Set initial active section and item on component mount
  useEffect(() => {
    if (items.length > 0) {
      const firstItem = items[0];
      setActiveItem(firstItem.id);
      setActiveSection(firstItem.text);
      navigate(firstItem.path);
    }
  }, []); // Re-run when role changes

  return (
    <motion.div
      className="w-[2.5%] p-0 m-0 h-full bg-Silver-4 relative"
      initial={{ width: "15%" }}
      animate={{ width: expanded ? "15%" : "80px" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <button
        onClick={toggleExpanded}
        className={`absolute ${
          expanded ? "-right-4" : "-right-6"
        } top-6 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 size-10 border-2 hidden lg:block`}
      >
        {expanded ? <img src={ArrowLeft} /> : <img src={ArrowRight} />}
      </button>
      <div
        className={`flex flex-col ${
          expanded ? "pl-6 pr-4" : "pl-2"
        }  pt-6 gap-6`}
      >
        <div
          id="logo"
          className="flex flex-row items-center justify-start gap-2"
        >
          <img src={Logo} alt="logo" className="size-12" />
          <motion.h2
            className={`font-bold text-2xl ${expanded ? "block" : "hidden"}`}
            initial={{ opacity: 1, width: "auto" }}
            animate={{
              opacity: expanded ? 1 : 0,
              width: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            SanOris
          </motion.h2>
        </div>
        <div
          id="address"
          className={`${
            expanded ? "border-2 border-Silver-2 block" : "hidden"
          } flex flex-row gap-2  rounded-lg p-3 items-center`}
        >
          <img src={Hospital} alt="hospital" className="size-8" />
          <motion.p
            className="text-textColor"
            initial={{ opacity: 1, width: "auto" }}
            animate={{
              opacity: expanded ? 1 : 0,
              width: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            36 Degla Square <br />
            st.200, Maadi
          </motion.p>
        </div>
        <div id="items" className="flex flex-col gap-3">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              isActive={activeItem === item.id}
              onClick={() => handleItemClick(item.id, item.text, item.path)}
            />
          ))}
        </div>
      </div>
      <hr className="w-full mt-4 text-Silver-2 border border-Silver-2 mb-6" />
      {role === "admin" ? (
        <div className={` ${expanded ? "ml-6 mr-3" : "ml-2"}`}>
          <SidebarItem
            icon={Support}
            text="HL7 Messages"
            isActive={activeItem === "hl7"}
            onClick={() => handleItemClick("hl7", "HL7 Messages", "/hl7")}
          />
        </div>
      ) : (
        ""
      )}
    </motion.div>
  );
};
