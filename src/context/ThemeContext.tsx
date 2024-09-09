// ThemeContext.tsx
import React, { createContext, useContext } from "react";

import { UserFriendlyTheme } from "../util/types";

interface ThemeContextType {
  theme?: Partial<UserFriendlyTheme>;
}

interface ThemeContextProps {
  children: React.ReactNode;
  theme?: Partial<UserFriendlyTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeContextProps> = ({
  children,
  theme
}) => {

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
