import { Image, StyleSheet, Text, View } from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "../util/types";

import Thunder from "../assets/images/thunder.png"

import { resizeFonts, responsiveScale } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";


type Props = {
  content: string;
};

const LightBox = ({ content }: Props) => {
  const { t } = useTranslation();
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image source={Thunder} style={styles.icon} />
      </View>
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
      alignItems: "center",
    },
    content: {
      fontSize: resizeFonts(16),
      color: theme.TEXT_COLOR,
      flex: 1,
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
      width: responsiveScale(18),
      height: responsiveScale(18),
    }
  });

}