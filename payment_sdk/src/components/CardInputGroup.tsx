import { StyleSheet, Text, View } from "react-native";
import React, { memo, useContext, useEffect, useRef } from "react";

import Input from "./Input";
import { Actions, DispatchContext, StateContext } from "../state";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";
import { formatCreditCardNumber, formatExpiry } from "../util/helpers";

const CardInputGroup = memo(() => {
  const dispatch = useContext(DispatchContext);
  const { cardCVV, cardNumber, cardExpiredDate } = useContext(StateContext);

  return (
    <View style={styles.parentContainer}>
      <Text style={styles.label}>Card Number</Text>
      <View style={styles.container}>
        <View style={styles.cardNumberRow}>
          <Input
            value={cardNumber}
            placeholder="1234 1234 1234 1234"
            onChangeText={(text: string) => {
              if (isCardNumberValid(text)) {
                let derivedText = formatCreditCardNumber(text);
                dispatch({
                  type: Actions.SET_CARD_NUMBER,
                  payload: derivedText,
                });
              }
            }}
          />
        </View>
        <View style={styles.splitRow}>
          <View style={styles.firstSplitItem}>
            <Input
              value={cardExpiredDate}
              placeholder="MM / YY"
              onChangeText={(text: string) => {
                if (validateCardExpiry(text)) {
                  dispatch({
                    type: Actions.SET_CARD_EXPIRED_DATE,
                    payload: formatExpiry(text),
                  });
                }
              }}
            />
          </View>
          <View style={styles.nextSplitItem}>
            <Input
              value={cardCVV}
              placeholder="CVV"
              onChangeText={(text: string) => {
                dispatch({ type: Actions.SET_CARD_CVV, payload: text });
              }}
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CAD6E1",
    maxHeight: 120,
  },
  cardNumberRow: {
    flex: 1,
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#CAD6E1",
  },
  splitRow: {
    flex: 1,
    flexDirection: "row",
    height: 60,
  },
  firstSplitItem: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#CAD6E1",
  },
  nextSplitItem: {
    flex: 1,
  },
});
