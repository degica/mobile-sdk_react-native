import { useColorScheme } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { appTheme } from "./defaultColorTheme";
import { ThemeSchemeType } from "../util/types";

export const useCurrentTheme = (): ThemeSchemeType => {
  const { mode, theme } = useTheme();
  const systemColorScheme = useColorScheme();
  const effectiveMode = systemColorScheme || mode;

  // Get the base theme
  const baseTheme = appTheme[effectiveMode as keyof typeof appTheme];

  // If there's no custom theme, return the base theme
  if (!theme) {
    return baseTheme;
  }

  // Merge the base theme with the custom theme
  return Object.keys(baseTheme).reduce((acc, key) => {
    const themeKey = key as keyof ThemeSchemeType;
    acc[themeKey] = theme[themeKey] !== undefined ? theme[themeKey]! : baseTheme[themeKey];
    return acc;
  }, {} as ThemeSchemeType);
};