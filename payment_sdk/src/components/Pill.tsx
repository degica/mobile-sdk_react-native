import React, { ReactNode } from "react";

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "@util/types";

import { resizeFonts, responsiveScale, WINDOW_WIDTH } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

interface PillProps {
  label: string;
  icon?: ImageSourcePropType;
  image?: ReactNode;
  onPress: () => void;
  isSelected?: boolean;
}

const Pill: React.FC<PillProps> = ({
  label,
  icon,
  image,
  onPress,
  isSelected,
}) => {
  const { t } = useTranslation();
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.activeDeco]}
      onPress={onPress}
    >
      {image ? image : <Image style={styles.icon} source={icon} />}

      <Text style={styles.label}>{t(label)}</Text>
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
      width: (WINDOW_WIDTH - responsiveScale(32)) / 3,
      marginRight: responsiveScale(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
    icon: {
      marginRight: responsiveScale(8),
    },
    label: {
      fontSize: resizeFonts(16),
      color: theme.TEXT_COLOR,
      fontWeight: "500",
    },
    activeDeco: {
      borderColor: theme.TEXT_COLOR,
    },
  });
}

export default Pill;
