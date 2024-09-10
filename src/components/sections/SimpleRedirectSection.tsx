import { StyleSheet, View } from "react-native";

import useSessionPayHandler from "../../hooks/useSessionPayHandler";

import LightBox from "../../components/LightBox";

import { LangKeys } from "../../util/constants";
import { PaymentType, ThemeSchemeType } from "../../util/types";

import { resizeFonts, responsiveScale } from "../../theme/scalling";
import { useCurrentTheme } from "../../theme/useCurrentTheme";

import KomojuText from "../KomojuText";
import SubmitButton from "../SubmitButton";

type SimpleRedirectSectionProps = {
  type: PaymentType;
};

const SimpleRedirectSection = ({ type }: SimpleRedirectSectionProps) => {
  const { sessionPay } = useSessionPayHandler();

  const theme = useCurrentTheme();
  const styles = getStyles(theme);
  const onPay = () => {
    sessionPay({ paymentType: type });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <KomojuText
          style={styles.title}
        >{`PAYMENT_VIA_${LangKeys[type]}`}</KomojuText>
        <KomojuText style={styles.description}>
          {`${LangKeys[type]}_REDIRECT_MESSAGE`}
        </KomojuText>
      </View>
      <View style={styles.lbWrapper}>
        <LightBox content="LIGHT_BOX_CONTENT" />
      </View>
      <View style={styles.btn}>
        <SubmitButton onPress={onPay} label={`CONTINUE_TO_${LangKeys[type]}`} />
      </View>
    </View>
  );
};

export default SimpleRedirectSection;

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    textContent: {
      marginBottom: responsiveScale(24),
      marginTop: responsiveScale(16),
      marginHorizontal: responsiveScale(16),
    },
    title: {
      fontSize: resizeFonts(20),
      fontWeight: "bold",
      color: theme.TEXT_COLOR,
      marginBottom: responsiveScale(8),
    },
    description: {
      fontSize: resizeFonts(16),
      color: theme.TEXT_COLOR,
    },
    lbWrapper: {
      minHeight: responsiveScale(80),
      marginHorizontal: responsiveScale(16),
      marginBottom: responsiveScale(24),
    },
    btn: {
      height: responsiveScale(60),
      marginBottom: responsiveScale(24),
    },
  });
};
