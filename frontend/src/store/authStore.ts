// Importing required functions from Zustand and its middleware package
import { create } from "zustand"; // Core function to create a Zustand store
import { persist, createJSONStorage } from "zustand/middleware"; // Middleware for state persistence

// Importing the User type for type safety in TypeScript
import { User } from "../types/types";

// Define the AuthState interface to specify the shape of the authentication state
interface AuthState {
  // `currentUser`: Holds the currently authenticated user's data. It can be:
  //   - Undefined (pending state, when user data is being fetched)
  //   - Null (checked and user is not authenticated)
  currentUser?: User | null;

  // `token`: Stores the authentication token (e.g., JWT). It can also be:
  //   - Undefined (pending state)
  //   - Null (no token available)
  token?: string | null;

  // `isAuthenticated`: Boolean to indicate whether the user is logged in or not
  isAuthenticated: boolean;

  // `login`: Function to log the user in. Accepts:
  //   - `currentUserData`: User object to set as `currentUser`
  //   - `token`: String representing the authentication token
  login: (currentUserData: User, token: string) => void;

  // `logout`: Function to log the user out. Resets the authentication state
  logout: () => void;
}

// Creating the Zustand store
export const useAuthStore = create<AuthState>()(
  // Wrapping the store in `persist` middleware to enable state persistence
  persist(
    // The state and actions of the store
    (set) => ({
      // Initial state when the app loads
      currentUser: null, // No user logged in by default
      token: null, // No token available
      isAuthenticated: false, // User is not authenticated initially

      // `login` function: Updates the state when the user logs in
      login: (currentUserData, token) =>
        set(() => ({
          currentUser: currentUserData, // Set the user data
          token, // Set the token
          isAuthenticated: true, // Mark the user as authenticated
        })),

      // `logout` function: Resets the state when the user logs out
      logout: () =>
        set(() => ({
          currentUser: null, // Clear the user data
          token: null, // Clear the token
          isAuthenticated: false, // Mark the user as not authenticated
        })),
    }),
    {
      // Options for the `persist` middleware

      // `name`: The key under which the state will be saved in storage
      name: "auth-storage",

      // `storage`: Specifies the storage mechanism (e.g., `localStorage` in this case)
      storage: createJSONStorage(() => localStorage),

      // `partialize`: Defines which parts of the state should be saved in storage
      // Here, only `currentUser` and `token` are persisted
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
      }),
    }
  )
);
