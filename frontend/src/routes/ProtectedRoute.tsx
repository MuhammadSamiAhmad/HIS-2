import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Role = "patient" | "doctor" | "admin";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children?: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  children,
  redirectPath = "/sign-in",
}: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuthStore();

  // If user is not authenticated, redirect to sign-in
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths = {
      patient: "/patient-reservations",
      doctor: "/doctor-dashboard",
      admin: "/employee-dashboard",
    };

    // Redirect to user's default dashboard if they try to access unauthorized route
    return <Navigate to={dashboardPaths[currentUser.role]} replace />;
  }

  // If role is allowed, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
