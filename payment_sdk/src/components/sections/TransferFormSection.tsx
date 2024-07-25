import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import Input from "@components/Input";

import { formatCurrency } from "@util/helpers";
import { PaymentType } from "@util/types";

import { responsiveScale } from "@theme/scalling";

import SubmitButton from "../SubmitButton";

type TransferFormSectionProps = {
  type: PaymentType;
}

const TransferFormSection = ({ type }: TransferFormSectionProps) => {
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
          label="SURNAME"
          placeholder="SURNAME"
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
          label="GIVEN_NAME"
          placeholder="GIVEN_NAME"
          onChangeText={(text: string) => {
            // resetError("email");
            // dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
        // error={inputErrors.email}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={""}
          label="LAST_NAME"
          placeholder="LAST_NAME"
          onChangeText={(text: string) => {
            // resetError("email");
            // dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
        // error={inputErrors.email}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={""}
          label="FIRST_NAME"
          placeholder="FIRST_NAME"
          onChangeText={(text: string) => {
            // resetError("email");
            // dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
        // error={inputErrors.email}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={""}
          label="EMAIL"
          placeholder="EXAMPLE_EMAIL"
          onChangeText={(text: string) => {
            // resetError("email");
            // dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
        // error={inputErrors.email}
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
        <SubmitButton
          label="PAY"
          labelSuffix={formatCurrency({ amount, currency })}
          onPress={onPay}
          testID="PayCTA"
        />
      </View>
    </View>
  );
};

export default TransferFormSection;

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