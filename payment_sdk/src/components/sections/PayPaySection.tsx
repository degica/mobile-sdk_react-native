import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import { PaymentType } from "@util/types";

import KomojuText from "../KomojuText";
import LightBox from "../LightBox";
import SubmitButton from "../SubmitButton";

const PayPaySection = () => {
  const { sessionPay } = useContext(StateContext);

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
      <SubmitButton onPress={onPay} label="CONTINUE_TO_PAY_PAY" />
    </View>
  );
};

export default PayPaySection;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  textContent: {
    marginBottom: 24,
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#172E44",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#172E44",
  },
  lbWrapper: {
    minHeight: 80,
    marginHorizontal: 16,
    marginBottom: 24,
  },
});
