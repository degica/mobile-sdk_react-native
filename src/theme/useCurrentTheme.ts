import { useTheme } from "../context/ThemeContext";
import { appTheme } from "./defaultColorTheme";
import { ThemeSchemeType } from "../util/types";
import { fromUserFriendlyTheme } from "../util/helpers";

export const useCurrentTheme = (): ThemeSchemeType => {
  const { theme } = useTheme();
  // const systemColorScheme = useColorScheme();
  const effectiveMode = "light";

  // Get the base theme
  const baseTheme = appTheme[effectiveMode as keyof typeof appTheme];

  // If there's no custom theme, return the base theme
  const mergedTheme = theme ? { ...baseTheme, ...fromUserFriendlyTheme(theme) } : baseTheme;

  // Merge the base theme with the custom theme
  return mergedTheme
};