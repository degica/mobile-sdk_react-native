import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import Input from "@components/Input";

import { LangKeys } from "@util/constants";
import { formatCurrency } from "@util/helpers";
import { PaymentType } from "@util/types";

import { responsiveScale } from "@theme/scalling";

import SubmitButton from "../SubmitButton";

type SingleInputFormSectionProps = {
  type: PaymentType;
}

const SingleInputFormSection = ({ type }: SingleInputFormSectionProps) => {
  const onPay = () => {
    sessionPay({ paymentType: PaymentType.PAY_PAY });
  };

  const {
    sessionPay,
    amount,
    currency,
  } = useContext(StateContext);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardNameContainer}>
        <Input
          value={""}
          label={`${LangKeys[type]}_INPUT_LABEL`}
          placeholder={`${LangKeys[type]}_INPUT_PLACEHOLDER`}
          onChangeText={(text: string) => {
            console.log(text)
            // resetError("name");
            // dispatch({ type: Actions.SET_CARDHOLDER_NAME, payload: text });
          }}
          inputStyle={styles.inputStyle}
          // error={inputErrors.name}
          testID="cardHolderName"
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

export default SingleInputFormSection;

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    flexGrow: 1,
  },
  cardNameContainer: {
    margin: responsiveScale(16),
    marginBottom: responsiveScale(24),
    height: responsiveScale(60),
  },
  btn: {
    height: responsiveScale(60),
    marginVertical: responsiveScale(24),
  },
  inputStyle: {
    height: responsiveScale(50),
  },
});
