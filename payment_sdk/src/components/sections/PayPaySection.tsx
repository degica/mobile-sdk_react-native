import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import { PaymentType, ThemeSchemeType } from "@util/types";

import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

import KomojuText from "../KomojuText";
import LightBox from "../LightBox";
import SubmitButton from "../SubmitButton";

const PayPaySection = () => {
  const { sessionPay } = useContext(StateContext);
  const theme = useCurrentTheme();
  const styles = getStyles(theme);
  const onPay = () => {
    sessionPay({ paymentType: PaymentType.PAY_PAY });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <KomojuText style={styles.title}>PAYMENT_VIA_PAY_PAY</KomojuText>
        <KomojuText style={styles.description}>
          PAY_PAY_REDIRECT_MESSAGE
        </KomojuText>
      </View>
      <View style={styles.lbWrapper}>
        <LightBox
          content="Lorem ipsum dolor sit amet consectetur. Etiam accumsan nunc "
          icon="📱"
        />
      </View>
      <View style={styles.btn}>
        <SubmitButton onPress={onPay} label="CONTINUE_TO_PAY_PAY" />
      </View>
    </View>
  );
};

export default PayPaySection;

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
    },
  });
}
