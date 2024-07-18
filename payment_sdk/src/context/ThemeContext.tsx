// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

import { Appearance } from 'react-native';

import { ThemeModes } from '@util/constants';

interface ThemeContextType {
  mode: ThemeModes;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeModes>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? ThemeModes.dark : ThemeModes.light;
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme === 'dark' ? ThemeModes.dark : ThemeModes.light);
    });

    return () => subscription.remove();
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => 
      prevMode === ThemeModes.light ? ThemeModes.dark : ThemeModes.light
    );
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};