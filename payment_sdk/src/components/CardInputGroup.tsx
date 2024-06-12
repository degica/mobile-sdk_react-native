import { Image, StyleSheet, Text, View } from "react-native";
import React, { memo, useContext, useEffect, useRef, useState } from "react";

import Input from "./Input";
import ScanCardButton from "./ScanCardButton";
import { Actions, DispatchContext, StateContext } from "../state";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";
import {
  determineCardType,
  formatCreditCardNumber,
  formatExpiry,
} from "../util/helpers";

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
  const [cardType, setCardType] = useState<string | null>(null);
  const { cardCVV, cardNumber, cardExpiredDate } = useContext(StateContext);

  useEffect(() => {
    // Determine card type and set it on first render if cardNumber is not empty
    if (cardNumber) {
      const type = determineCardType(cardNumber);
      setCardType(type);
    }
  }, []);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.titleScanRow}>
        <Text style={styles.label}>Card Number</Text>
        <ScanCardButton />
      </View>
      <View style={styles.container}>
        <View style={styles.cardNumberRow}>
          <Input
            value={cardNumber}
            testID="cardNumberInput"
            keyboardType="number-pad"
            placeholder="1234 1234 1234 1234"
            onChangeText={(text: string) => {
              resetError("number");
              if (isCardNumberValid(text)) {
                let derivedText = formatCreditCardNumber(text);
                dispatch({
                  type: Actions.SET_CARD_NUMBER,
                  payload: derivedText,
                });
                // Determine card type and set it
                const type = determineCardType(text);
                setCardType(type);
              }
            }}
            inputStyle={styles.numberInputStyle}
            error={inputErrors.number}
          />
          <View style={styles.cardContainer}>
            {cardType === "visa" || !cardType ? (
              <Image
                source={require("../assets/images/visa.png")}
                style={{
                  ...styles.cardImage,
                }}
              />
            ) : null}
            {cardType === "master" || !cardType ? (
              <Image
                source={require("../assets/images/master.png")}
                style={{
                  ...styles.cardImage,
                }}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.splitRow}>
          <View style={styles.itemRow}>
            <Input
              value={cardExpiredDate}
              keyboardType="number-pad"
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
              keyboardType="number-pad"
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
  titleScanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 15,
    right: 0,
    marginRight: 8,
  },
  cardImage: {
    width: 26,
    marginRight: 8,
  },
});
