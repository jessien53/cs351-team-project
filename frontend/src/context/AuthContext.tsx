import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

const MOCK_USER = {
  id: "b8df5a8b-316d-4db1-b3b9-56745f9c8517",
  full_name: "Emily Allen",
};

// Define the shape of the context
interface AuthContextType {
  currentUser: {
    id: string;
    full_name: string;
  } | null;
  // In the future, add login/logout functions here
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
});

// Create a simple provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Provide the MOCK_USER as the "currently logged in" user
  const value = {
    currentUser: MOCK_USER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};