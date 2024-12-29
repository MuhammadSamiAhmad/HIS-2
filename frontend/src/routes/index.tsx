// Importing necessary functions and components from React Router and the project
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SystemLayout } from "../components/SystemLayout"; // Layout for the system's authenticated pages
import { AuthenticationLayout } from "../components/AuthenticationLayout"; // Layout for authentication-related pages
import SignInPage from "../pages/SignInPage"; // Component for the "Sign In" page
import SignUpPage from "../pages/SignUpPage"; // Component for the "Sign Up" page
import VerificationPage from "../pages/VerificationPage"; // Component for the "Verification" page
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import PatientReservations from "../pages/patient/PatientReservations";
import ProtectedRoute from "./ProtectedRoute";
import PatientInvoices from "../pages/patient/PatientInvoices";
import PatientMedicalRecord from "../pages/patient/PatientMedicalRecord";
import EmployeeDoctors from "../pages/employee/EmployeeDoctors";
import EmployeePatients from "../pages/employee/EmployeePatients";
import EmployeeReservations from "../pages/employee/EmployeeReservations";
import Inventory from "../pages/employee/Inventory";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import DoctorReservations from "../pages/doctor/DoctorReservations";
import Account from "../pages/Account";
import HL7 from "../pages/HL7";
import HL7Display from "../pages/HL7Display";

// Creating the router using `createBrowserRouter`
// This defines the routes and structure of the application
export const router = createBrowserRouter([
  {
    // Route group for authentication-related pages
    element: <AuthenticationLayout />, // The parent layout for all child routes defined here
    children: [
      // Redirect from the root path "/" to the "Sign In" page
      {
        path: "/", // Base path of the application
        element: <Navigate to="/sign-in" replace />, // Redirects to "/sign-in" and replaces history
      },

      // Route for the "Sign In" page
      {
        path: "/sign-in", // URL for the sign-in page
        element: <SignInPage />, // Component rendered when this path is accessed
      },

      // Route for the "Sign Up" page
      {
        path: "/sign-up", // URL for the sign-up page
        element: <SignUpPage />, // Component rendered when this path is accessed
      },

      // Route for the "Verification" page
      {
        path: "/verification", // URL for the verification page
        element: <VerificationPage />, // Component rendered when this path is accessed
      },
    ],
  },
  {
    // Route group for system-related pages (e.g., dashboard, profile, etc.)
    element: <SystemLayout />, // The parent layout for all child routes defined here
    children: [
      // Direct routes to specific dashboards
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-doctors",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeeDoctors />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-patients",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeePatients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-reservations",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeeReservations />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inventory",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Inventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/hl7",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <HL7 />
          </ProtectedRoute>
        ),
      },
      {
        path: "/hl7-display",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <HL7Display />
          </ProtectedRoute>
        ),
      },
      {
        path: "/doctor-patients",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorPatients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/doctor-reservations",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorReservations />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patient-reservations",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientReservations />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patient-medicalrecord",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientMedicalRecord />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patient-invoices",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
]);

/*
============================================================
                        Code Explanation
============================================================

1. **`createBrowserRouter`**:
   - This function is part of React Router v6 and is used to define the structure of your application's routing.
   - It organizes routes into a tree-like structure, with support for nested routes.

2. **Route Groups**:
   - **First Group (`AuthenticationLayout`)**:
     - This group contains routes related to user authentication (`/sign-in`, `/sign-up`, etc.).
     - It uses the `AuthenticationLayout` as the parent layout, which might include elements like headers, footers, or a consistent page structure for authentication pages.
   - **Second Group (`SystemLayout`)**:
     - This group contains routes for system-related pages (e.g., dashboard, profile, settings).
     - It uses the `SystemLayout` as the parent layout, which might include a sidebar, navigation bar, etc.

3. **Child Routes**:
   - Each route has:
     - **`path`**: The URL path the user navigates to (e.g., `/sign-in`).
     - **`element`**: The React component rendered for that route.

4. **Redirection**:
   - The root path (`/`) is handled using `<Navigate>`, which redirects users to `/sign-in`.

5. **Nested Routing**:
   - The child routes (`children` array) inherit the layout of their parent.
   - For example, all authentication-related routes (`/sign-in`, `/sign-up`) are wrapped by `AuthenticationLayout`.

6. **Protected Routes** (Commented Out):
   - Routes like `/dashboard` are protected, meaning only specific users can access them.
   - This is handled using a `ProtectedRoute` wrapper, which checks user roles before rendering the target component.

---

### **Example of Usage**
Here’s how the router integrates with the app:
1. When a user navigates to `/`:
   - The router redirects to `/sign-in`.
   - The `AuthenticationLayout` is rendered, and inside it, the `SignInPage` is displayed.

2. When a user navigates to `/sign-up`:
   - The `AuthenticationLayout` is rendered again, but now the `SignUpPage` component is displayed.

3. When a user navigates to `/dashboard` (after implementing the route):
   - The `SystemLayout` is rendered.
   - If the user’s role is `admin` or `doctor`, the `DashboardPage` is displayed. Otherwise, they’re redirected to `/unauthorized`.

---

### **Key Concepts to Revise**
- **Layouts**:
  - Used to wrap multiple routes with a consistent design (e.g., authentication or system).
- **Nested Routing**:
  - Allows grouping routes under a parent layout for better structure.
- **Redirection**:
  - `<Navigate>` helps guide users to the correct page.
- **Protected Routes**:
  - Ensure only authorized users can access sensitive pages.

============================================================
*/
