import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { StyleSheet, View } from "react-native";

import { SvgCssUri } from "react-native-svg/css";

import { Actions, DispatchContext, StateContext } from "@context/state";

import {
  BASE_URL,
  STATIC_CREDIT_CARD_CVC_SVG,
  STATIC_CREDIT_CARD_SVG,
} from "@util/constants";
import {
  determineCardType,
  formatCreditCardNumber,
  formatExpiry,
} from "@util/helpers";
import { PaymentType, sessionShowPaymentMethodType } from "@util/types";
import { isCardNumberValid, validateCardExpiry } from "@util/validator";

import CardScanner from "./CardScanner";
import Input from "./Input";
import KomojuText from "./KomojuText";
import ScanCardButton from "./ScanCardButton";

type Props = {
  inputErrors: {
    number: boolean;
    expiry: boolean;
    cvv: boolean;
  };
  resetError: (type: string) => void;
};

const CARD_WIDTH = 26;
const CARD_HEIGHT = 30;

const CardInputGroup = memo(({ inputErrors, resetError }: Props) => {
  const dispatch = useContext(DispatchContext);
  const [cardType, setCardType] = useState<string | null>(null);
  const [toggleScanCard, setToggleScanCard] = useState<boolean>(false);
  const { cardCVV, cardNumber, cardExpiredDate, paymentMethods } =
    useContext(StateContext);

  useEffect(() => {
    // Determine card type and set it on first render if cardNumber is not empty
    if (cardNumber) {
      const type = determineCardType(cardNumber);
      setCardType(type);
    }
  }, []);

  const renderSvg = (uri: string, widthMultiplier = 1) => (
    <SvgCssUri
      width={CARD_WIDTH * widthMultiplier}
      height={CARD_HEIGHT}
      uri={uri}
    />
  );

  //Toggle card scanner
  const toggleCardScanner = () => {
    setToggleScanCard((prevState: boolean) => !prevState);
  };

  // Create card image list
  const cardImage = useCallback(() => {
    const cardUri = `${BASE_URL}/payment_methods/${PaymentType.CREDIT}.svg?brands=`;
    // Select credit card payment method data from session response payment methods
    const cardPaymentMethodData = paymentMethods?.find(
      (method: sessionShowPaymentMethodType) =>
        method?.type === PaymentType.CREDIT
    );
    // If card number input is empty or user input does not match any card type showing all available card payment methods
    const allCardTypes = cardPaymentMethodData?.brands?.toString();
    const cardTypesCount = allCardTypes?.split(",")?.length ?? 1;

    /**
     * if card number field is empty or less than 2 digits showing all available card brands
     * if user typed card number matched showing relevant card type
     * if card number is more than 2 digits and not matching for any brand showing static credit card svg
     */
    if (cardType === "unknown") {
      return renderSvg(STATIC_CREDIT_CARD_SVG);
    } else if (cardType) {
      return renderSvg(`${cardUri}${cardType}`);
    } else if (allCardTypes) {
      return renderSvg(`${cardUri}${allCardTypes}`, cardTypesCount);
    }
  }, [cardType, paymentMethods]);

  const onCardScanned = useCallback(
    (cardDetails: { cardNumber?: string; expirationDate?: string }) => {
      dispatch({
        type: Actions.SET_CARD_NUMBER,
        payload: cardDetails.cardNumber,
      });
      dispatch({
        type: Actions.SET_CARD_EXPIRED_DATE,
        payload: cardDetails.expirationDate,
      });
      setToggleScanCard(false);
    },
    []
  );

  return (
    <View style={styles.parentContainer}>
      <View style={styles.titleScanRow}>
        <KomojuText style={styles.label}>CARD_NUMBER</KomojuText>
        <ScanCardButton onPress={toggleCardScanner} />
      </View>
      {toggleScanCard ? (
        <View style={styles.scanContainer}>
          <CardScanner
            isVisible={toggleScanCard}
            onCardScanned={onCardScanned}
          />
        </View>
      ) : (
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
                  const derivedText = formatCreditCardNumber(text);
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

                  if (text?.length < 11)
                    dispatch({ type: Actions.SET_CARD_CVV, payload: text });
                }}
                inputStyle={styles.cvvInputStyle}
                error={inputErrors.cvv}
              />
              <View style={styles.cardContainer}>
                {renderSvg(STATIC_CREDIT_CARD_CVC_SVG)}
              </View>
            </View>
          </View>
        </View>
      )}
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
    top: 9,
    right: 0,
    marginRight: 8,
  },
  cardImage: {
    width: 26,
    marginRight: 8,
  },
  scanContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
