"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
// context/AppContext.js
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AppContext = createContext(null);

// Provider Component
export const AppProvider = ({ children }) => {
  // Define global states here
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [tool, setTool] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  const logout = () => {
    signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Set up a single auth state listener to prevent multiple refreshes
  useEffect(() => {
    let isMounted = true;

    // Only set up the listener if auth hasn't been initialized yet
    if (!authInitialized) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (isMounted) {
          setIsAuthenticated(!!user);
          setAuthInitialized(true);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [authInitialized]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        tool,
        setTool,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook (Optional)
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
