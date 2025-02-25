"use client";

// context/AppContext.js
import { createContext, useContext, useState } from "react";

// Create Context
const AppContext = createContext(null);

// Provider Component
export const AppProvider = ({ children }) => {
  // Define global states here
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [tool, setTool] = useState(null);

  return (
    <AppContext.Provider
      value={{ user, setUser, theme, setTheme, tool, setTool }}
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
