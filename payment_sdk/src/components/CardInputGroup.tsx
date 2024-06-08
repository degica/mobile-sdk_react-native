import { StyleSheet, Text, View } from "react-native";
import React, { memo, useContext, useEffect, useRef } from "react";

import Input from "./Input";
import { Actions, DispatchContext, StateContext } from "../state";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";
import { formatCreditCardNumber, formatExpiry } from "../util/helpers";

type Props = {
  inputErrors: {
    number: boolean;
    expiry: boolean;
    cvv: boolean;
  };
  resetError: (type: string) => void;
};

const CardInputGroup = memo(({ inputErrors, resetError }: Props) => {
  const dispatch = useContext(DispatchContext);
  const { cardCVV, cardNumber, cardExpiredDate } = useContext(StateContext);

  return (
    <View style={styles.parentContainer}>
      <Text style={styles.label}>Card Number</Text>
      <View style={styles.container}>
        <View style={styles.cardNumberRow}>
          <Input
            value={cardNumber}
            testID="cardNumberInput"
            placeholder="1234 1234 1234 1234"
            onChangeText={(text: string) => {
              resetError("number");
              if (isCardNumberValid(text)) {
                let derivedText = formatCreditCardNumber(text);
                dispatch({
                  type: Actions.SET_CARD_NUMBER,
                  payload: derivedText,
                });
              }
            }}
            inputStyle={styles.numberInputStyle}
            error={inputErrors.number}
          />
        </View>
        <View style={styles.splitRow}>
          <View style={styles.itemRow}>
            <Input
              value={cardExpiredDate}
              testID="cardExpiryInput"
              placeholder="MM / YY"
              onChangeText={(text: string) => {
                resetError("expiry");
                if (validateCardExpiry(text)) {
                  dispatch({
                    type: Actions.SET_CARD_EXPIRED_DATE,
                    payload: formatExpiry(text),
                  });
                }
              }}
              inputStyle={styles.expiryInputStyle}
              error={inputErrors.expiry}
            />
          </View>
          <View style={styles.itemRow}>
            <Input
              value={cardCVV}
              testID="cardCVVInput"
              placeholder="CVV"
              onChangeText={(text: string) => {
                resetError("cvv");

                dispatch({ type: Actions.SET_CARD_CVV, payload: text });
              }}
              inputStyle={styles.cvvInputStyle}
              error={inputErrors.cvv}
            />
          </View>
        </View>
      </View>
    </View>
  );
});

export default CardInputGroup;

const styles = StyleSheet.create({
  parentContainer: {
    margin: 16,
    marginBottom: 24,
    flexGrow: 0,
    minHeight: 130,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#172E44",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    maxHeight: 120,
  },
  cardNumberRow: {
    flex: 1,
    height: 60,
  },
  splitRow: {
    flex: 1,
    flexDirection: "row",
    height: 60,
  },
  itemRow: {
    flex: 1,
  },
  numberInputStyle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  expiryInputStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  cvvInputStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
