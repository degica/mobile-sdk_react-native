import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import Input from "@components/Input";

import { LangKeys } from "@util/constants";
import { PaymentType } from "@util/types";

import { responsiveScale } from "@theme/scalling";

import SubmitButton from "../SubmitButton";

type PaidyFormSectionProps = {
  type: PaymentType;
}

const PaidyFormSection = ({ type }: PaidyFormSectionProps) => {
  const onPay = () => {
    sessionPay({ paymentType: PaymentType.PAY_PAY });
  };

  const {
    sessionPay,
    amount,
    currency,
  } = useContext(StateContext);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Input
          value={""}
          label="FULL_NAME"
          placeholder="FULL_NAME_PLACEHOLDER"
          onChangeText={(text: string) => {
            // resetError("name");
            // dispatch({ type: Actions.SET_NAME, payload: text });
          }}
          inputStyle={styles.inputStyle}
        // error={inputErrors.name}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={""}
          label="TELEPHONE_NUMBER"
          placeholder="TELEPHONE_NUMBER_PLACEHOLDER"
          onChangeText={(text: string) => {
            // resetError("email");
            // dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
          // error={inputErrors.email}
        />
      </View>
      <View style={styles.btn}>
        <SubmitButton onPress={onPay} label={`CONTINUE_TO_${LangKeys[type]}`} />
      </View>
    </View>
  );
};

export default PaidyFormSection;

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    flex: 1,
  },
  inputContainer: {
    margin: responsiveScale(16),
    marginBottom: responsiveScale(24),
    height: responsiveScale(60),
  },
  inputStyle: {
    height: responsiveScale(50),
  },
  btn: {
    height: responsiveScale(60),
    marginTop: responsiveScale(24),
  },
});