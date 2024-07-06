import React, { useState, useContext } from "react";

import { StyleSheet, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "@context/state";

import { formatCurrency } from "@util/helpers";
import { PaymentType } from "@util/types";
import { validateCardFormFields } from "@util/validator";

import CardInputGroup from "../CardInputGroup";
import Input from "../Input";
import SubmitButton from "../SubmitButton";

const initialErrors = {
  name: false,
  number: false,
  expiry: false,
  cvv: false,
};

/**
 * CardSection component for displaying and handling the card payment form.
 * @param {Props} props - The props for the CardSection component.
 * @returns {JSX.Element} The CardSection component.
 */

const CardSection = (): JSX.Element => {
  const [inputErrors, setInputErrors] = useState(initialErrors);

  const {
    sessionPay,
    cardholderName,
    cardCVV,
    cardNumber,
    cardExpiredDate,
    amount,
    currency,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const resetError = (type: string) => {
    // TODO: Fix this type error
    // @ts-expect-error - Type 'string' cannot be used to index type 'object'.
    setInputErrors((pre: object) => ({ ...pre, [type]: false }));
  };

  const onPay = () => {
    const isValid = validateCardFormFields({
      cardholderName,
      cardCVV,
      cardNumber,
      cardExpiredDate,
      // TODO: Fix this type error
      // @ts-expect-error - Type 'object' is not assignable to type 'SetStateAction<object>'.
      setInputErrors,
    });

    if (isValid) {
      sessionPay({
        paymentType: PaymentType.CREDIT,
        paymentDetails: {
          cardholderName,
          cardCVV,
          cardNumber,
          cardExpiredDate,
        },
      });
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardNameContainer}>
        <Input
          value={cardholderName ?? ""}
          label="CARD_HOLDER_NAME"
          placeholder="FULL_NAME_ON_CARD"
          onChangeText={(text: string) => {
            resetError("name");
            dispatch({ type: Actions.SET_CARDHOLDER_NAME, payload: text });
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.name}
          testID="cardHolderName"
        />
      </View>
      <CardInputGroup inputErrors={inputErrors} resetError={resetError} />
      <SubmitButton
        label="PAY"
        labelSuffix={formatCurrency({ amount, currency })}
        onPress={onPay}
        testID="PayCTA"
      />
    </View>
  );
};

export default CardSection;

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    flex: 1,
  },
  cardNameContainer: {
    margin: 16,
    marginBottom: 24,
    height: 60,
  },
  inputStyle: {
    height: 50,
  },
});
