// ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";

// import { Appearance } from "react-native";

import { ThemeModes } from "../util/constants";
import { ThemeSchemeType } from "../util/types";

interface ThemeContextType {
  mode: ThemeModes;
  theme?: Partial<ThemeSchemeType>;
  // toggleMode: () => void;
}

interface ThemeContextProps {
  children: React.ReactNode;
  theme?: Partial<ThemeSchemeType>;
  darkMode?: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeContextProps> = ({
  children,
  darkMode,
  theme
}) => {
  // const [mode, setMode] = useState<ThemeModes>(() => {
  //   // const colorScheme = Appearance.getColorScheme();
  //   return darkMode ? ThemeModes.dark : ThemeModes.light;
  // });

  const mode = darkMode ? ThemeModes.dark : ThemeModes.light;

  // useEffect(() => {
  //   const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     setMode(colorScheme === "dark" ? ThemeModes.dark : ThemeModes.light);
  //   });

  //   return () => subscription.remove();
  // }, []);

  // const toggleMode = () => {
  //   setMode((prevMode) =>
  //     prevMode === ThemeModes.light ? ThemeModes.dark : ThemeModes.light
  //   );
  // };

  return (
    <ThemeContext.Provider value={{ mode, theme }}>
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
