import { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <NavbarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </NavbarContext.Provider>
  );
};
