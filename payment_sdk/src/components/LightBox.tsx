import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "@util/types";

import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

type Props = {
  content: string;
  icon?: string;
};

const LightBox = ({ content, icon }: Props) => {
  const { t } = useTranslation();
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{icon && <Text style={styles.icon}>{icon}</Text>}</View>
      <Text style={styles.content}>{t(content)}</Text>
    </View>
  );
};

export default LightBox;

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: responsiveScale(16),
      flexDirection: "row",
      backgroundColor: theme.LIGHT_BOX,
      borderRadius: responsiveScale(8),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      fontSize: resizeFonts(16),
      color: theme.TEXT_COLOR,
      flex: 0.9,
    },
    iconWrapper: {
      marginRight: responsiveScale(8),
      borderRadius: responsiveScale(100),
      backgroundColor: theme.BACKGROUND_COLOR,
      width: responsiveScale(38),
      height: responsiveScale(38),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      fontSize: resizeFonts(20)
    }
  });

}