import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { StyleSheet, View, Image, Dimensions } from "react-native";

import { Actions, DispatchContext, StateContext } from "@context/state";

import {
  determineCardType,
  formatCreditCardNumber,
  formatExpiry,
} from "@util/helpers";
import {
  CardTypes,
  PaymentType,
  sessionShowPaymentMethodType,
  ThemeSchemeType,
} from "@util/types";
import { isCardNumberValid, validateCardExpiry } from "@util/validator";

// import CardScanner from "./CardScanner";
import CardImages, { CVC, DEFAULT } from "@assets/images/creditCardImages";

import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

import Input from "./Input";
import KomojuText from "./KomojuText";
// import ScanCardButton from "./ScanCardButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  inputErrors: {
    number: boolean;
    expiry: boolean;
    cvv: boolean;
  };
  resetError: (type: string) => void;
};

const CardInputGroup = ({ inputErrors, resetError }: Props) => {
  const dispatch = useContext(DispatchContext);
  const [cardType, setCardType] = useState<CardTypes | "unknown" | null>(null);
  // const [toggleScanCard, setToggleScanCard] = useState<boolean>(false);
  const theme = useCurrentTheme();
  const styles = getStyles(theme);
  const { cardCVV, cardNumber, cardExpiredDate, paymentMethods } =
    useContext(StateContext);

  useEffect(() => {
    // Determine card type and set it on first render if cardNumber is not empty
    if (cardNumber) {
      const type = determineCardType(cardNumber);
      setCardType(type);
    }
  }, [cardNumber]);

  //Toggle card scanner
  // const toggleCardScanner = () => {
  //   setToggleScanCard((prevState: boolean) => !prevState);
  // };

  const filterCardToScreenSize = (list: string[]) => {
    if (SCREEN_WIDTH > 380) {
      return list;
    } else if (SCREEN_WIDTH > 360) {
      return list.slice(0, 5);
    } else if (SCREEN_WIDTH > 340) {
      return list.slice(0, 4);
    } else if (SCREEN_WIDTH > 320) {
      return list.slice(0, 3);
    } else {
      return list.slice(0, 2);
    }
  };

  // Create card image list
  const cardImage = useCallback(() => {
    // Select credit card payment method data from session response payment methods
    const cardPaymentMethodData = paymentMethods?.find(
      (method: sessionShowPaymentMethodType) =>
        method?.type === PaymentType.CREDIT
    );
    // If card number input is empty or user input does not match any card type showing all available card payment methods
    const allCardTypes = cardPaymentMethodData?.brands?.toString();
    const cardTypesList = filterCardToScreenSize(
      allCardTypes?.split(",") ?? []
    );

    /**
     * if card number field is empty or less than 2 digits showing all available card brands
     * if user typed card number matched showing relevant card type
     * if card number is more than 2 digits and not matching for any brand showing static credit card svg
     */
    if (cardType === "unknown") {
      return <Image source={DEFAULT} style={styles.cardIcon} />;
    } else if (cardType) {
      return <Image source={CardImages[cardType]} style={styles.cardIcon} />;
    } else if (allCardTypes) {
      return cardTypesList?.map((card) => {
        const cardType = card as CardTypes;
        return Object.values(CardTypes).includes(cardType) ? (
          <Image
            key={card}
            source={CardImages[cardType]}
            style={styles.cardIcon}
          />
        ) : null;
      });
    }
  }, [cardType, paymentMethods]);

  // const onCardScanned = useCallback(
  //   (cardDetails: { cardNumber?: string; expirationDate?: string }) => {
  //     dispatch({
  //       type: Actions.SET_CARD_NUMBER,
  //       payload: cardDetails.cardNumber,
  //     });
  //     dispatch({
  //       type: Actions.SET_CARD_EXPIRED_DATE,
  //       payload: cardDetails.expirationDate,
  //     });
  //     setToggleScanCard(false);
  //   },
  //   []
  // );

  const RenderCardError = () => {
    if (inputErrors.number)
      return (
        <KomojuText style={styles.errorText}>CARD_NUMBER_ERROR</KomojuText>
      );
    if (inputErrors.expiry)
      return (
        <KomojuText style={styles.errorText}>EXPIRY_DATE_ERROR</KomojuText>
      );
    if (inputErrors.cvv)
      return <KomojuText style={styles.errorText}>CVV_ERROR</KomojuText>;

    return null;
  };

  return (
    <>
      <View style={styles.parentContainer}>
        <View style={styles.titleScanRow}>
          <KomojuText style={styles.label}>CARD_NUMBER</KomojuText>
          {/* <ScanCardButton onPress={toggleCardScanner} /> */}
        </View>
        <View style={styles.container}>
          <View
            style={[
              styles.cardNumberRow,
              inputErrors.number && styles.errorContainer,
            ]}
          >
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
            <View
              style={[
                styles.itemRow,
                inputErrors.expiry && styles.errorContainer,
              ]}
            >
              <Input
                value={cardExpiredDate as string}
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
            <View
              style={[styles.itemRow, inputErrors.cvv && styles.errorContainer]}
            >
              <Input
                value={cardCVV as string}
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
                <Image source={CVC} style={styles.cardIcon} />
              </View>
            </View>
          </View>
        </View>
      </View>
      <RenderCardError />
    </>
  );
};

export default memo(CardInputGroup);

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    parentContainer: {
      margin: responsiveScale(16),
      marginBottom: responsiveScale(24),
      flexGrow: 0,
      minHeight: responsiveScale(130),
    },
    label: {
      fontSize: resizeFonts(16),
      marginBottom: responsiveScale(8),
      color: theme.TEXT_COLOR,
    },
    container: {
      flex: 1,
      flexDirection: "column",
      maxHeight: responsiveScale(120),
    },
    cardNumberRow: {
      flex: 1,
      marginBottom: -responsiveScale(1),
      height: responsiveScale(60),
    },
    errorContainer: {
      zIndex: 5,
    },
    splitRow: {
      flex: 1,
      flexDirection: "row",
      height: responsiveScale(60),
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
      marginLeft: -responsiveScale(1),
    },
    titleScanRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: responsiveScale(8),
    },
    cardContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      top: responsiveScale(15),
      right: 0,
      marginRight: responsiveScale(6),
    },
    cardImage: {
      width: responsiveScale(26),
      marginRight: responsiveScale(8),
    },
    scanContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    cardIcon: {
      width: responsiveScale(25),
      height: responsiveScale(17),
      marginRight: responsiveScale(2),
      resizeMode: "contain",
    },
    errorText: {
      color: theme.ERROR,
      fontSize: resizeFonts(14),
      marginLeft: responsiveScale(16),
      top: -responsiveScale(20),
    },
  });
};
