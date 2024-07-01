import { StyleSheet, View } from "react-native";
import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { SvgCssUri } from "react-native-svg/css";

import Input from "./Input";
import ScanCardButton from "./ScanCardButton";
import { Actions, DispatchContext, StateContext } from "../state";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";
import {
  determineCardType,
  formatCreditCardNumber,
  formatExpiry,
} from "../util/helpers";
import KomojuText from "./KomojuText";
import { BASE_URL } from "../util/constants";
import { PaymentType, sessionShowPaymentMethodType } from "../util/types";

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
  const { cardCVV, cardNumber, cardExpiredDate, paymentMethods } =
    useContext(StateContext);

  useEffect(() => {
    // Determine card type and set it on first render if cardNumber is not empty
    if (cardNumber) {
      const type = determineCardType(cardNumber);
      setCardType(type);
    }
  }, []);

  // Create card image list
  const cardImage = useCallback(() => {
    const cardUri = `${BASE_URL}/payment_methods/${PaymentType.CREDIT}.svg?brands=`;
    // Select credit card payment method data from session response payment methods
    const cardPaymentMethodData = paymentMethods?.find(
      (method: sessionShowPaymentMethodType) =>
        method?.type === PaymentType.CREDIT
    );
    // If card number input is empty or user input does not match any card type showing all available card payment methods
    const allCardTypes = cardType ?? cardPaymentMethodData?.brands?.toString();
    const cardTypesCount = allCardTypes?.split(",")?.length;

    if (!allCardTypes) return null;
    return (
      <SvgCssUri
        width={26 * cardTypesCount ?? 1}
        height={30}
        uri={`${cardUri}${allCardTypes}`}
      />
    );
  }, [cardType, paymentMethods]);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.titleScanRow}>
        <KomojuText style={styles.label}>CARD_NUMBER</KomojuText>
        <ScanCardButton />
      </View>
      <View style={styles.container}>
        <View style={styles.cardNumberRow}>
          <Input
            value={cardNumber ?? ""}
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
          <View style={styles.cardContainer}>{cardImage()}</View>
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
