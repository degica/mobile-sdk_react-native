import React, { ReactNode } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";

import { ThemeSchemeType } from "../util/types";

import { resizeFonts, responsiveScale, WINDOW_WIDTH } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";

import KomojuText from "./KomojuText";

interface PillProps {
  label: string;
  icon?: ImageSourcePropType;
  image?: ReactNode;
  onPress: () => void;
  isSelected?: boolean;
  autoWidth?: boolean;
}

const Pill: React.FC<PillProps> = ({
  label,
  icon,
  image,
  onPress,
  isSelected,
  autoWidth
}) => {
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.activeDeco, !autoWidth && {
        width: (WINDOW_WIDTH - responsiveScale(32)) / 3,
      }]}
      onPress={onPress}
    >
      {image ? image : <Image style={styles.icon} source={icon} />}

      <KomojuText style={styles.label}>{label}</KomojuText>
    </TouchableOpacity>
  );
};

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: responsiveScale(16),
    },
    pill: {
      paddingHorizontal: responsiveScale(12),
      paddingVertical: responsiveScale(8),
      borderRadius: responsiveScale(8),
      height: responsiveScale(82),
      backgroundColor: theme.CARD_BACKGROUND,
      borderColor: theme.CARD_BORDER,
      borderWidth: 1,
      minWidth:(WINDOW_WIDTH - responsiveScale(32)) / 3,
      marginRight: responsiveScale(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
    icon: {
      marginRight: responsiveScale(8),
      flex: 1,
    },
    label: {
      fontSize: resizeFonts(14),
      color: theme.TEXT_COLOR,
      fontWeight: "500",
    },
    activeDeco: {
      borderColor: theme.TEXT_COLOR,
    },
  });
};

export default Pill;
