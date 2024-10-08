import { useState, useContext } from "react";

import { StyleSheet, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "../../context/state";

import { formatCurrency } from "../../util/helpers";
import { validateCardFormFields } from "../../util/validator";

import { responsiveScale } from "../../theme/scalling";

import CardInputGroup from "../CardInputGroup";
import Input from "../Input";
import SubmitButton from "../SubmitButton";
import useThreeDSecureHandler from "../../hooks/useThreeDSecureHandler";
import {
  CardDetailsType,
  PaymentMode,
  PaymentType,
  sessionDataType,
} from "../../util/types";
import useSessionPayHandler from "../../hooks/useSessionPayHandler";

const initialErrors = {
  email: false,
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
  const { threeDSecurePayment } = useThreeDSecureHandler();
  const { sessionPay } = useSessionPayHandler();
  const { cardData, sessionData } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const SessionData = sessionData as sessionDataType;

  const resetError = (type: string) => {
    // TODO: Fix this type error
    // @ts-expect-error - Type 'string' cannot be used to index type 'object'.
    setInputErrors((pre: object) => ({ ...pre, [type]: false }));
  };

  const onPay = () => {
    const isValid = validateCardFormFields({
      cardData,
      withEmail: SessionData?.mode === PaymentMode.Customer,
      // TODO: Fix this type error
      // @ts-expect-error - Type 'object' is not assignable to type 'SetStateAction<object>'.
      setInputErrors,
    });

    if (isValid) {
      const cardDataObj: CardDetailsType = {
        cardholderName: cardData?.cardholderName,
        cardCVV: cardData?.cardCVV,
        cardNumber: cardData?.cardNumber,
        cardExpiredDate: cardData?.cardExpiredDate,
      };
      if (cardData?.cardholderEmail) {
        cardDataObj.cardholderEmail = cardData?.cardholderEmail;
      }

      if (SessionData?.mode === PaymentMode.Customer) {
        sessionPay({
          paymentType: PaymentType.CREDIT,
          paymentDetails: cardDataObj,
        });
      } else {
        threeDSecurePayment(cardDataObj);
      }
    }
  };

  return (
    <View style={styles.cardContainer}>
      {SessionData?.mode === PaymentMode.Customer ? (
        <View style={styles.cardNameContainer}>
          <Input
            value={cardData?.cardholderEmail ?? ""}
            label="EMAIL"
            placeholder="EXAMPLE_EMAIL"
            onChangeText={(text: string) => {
              resetError("email");
              dispatch({
                type: Actions.SET_CARD_DATA,
                payload: { cardholderEmail: text },
              });
            }}
            inputStyle={styles.inputStyle}
            error={inputErrors.email}
            errorText="EMAIL_ERROR"
            autoCapitalize="none"
            inputMode="email"
          />
        </View>
      ) : null}
      <View style={styles.cardNameContainer}>
        <Input
          value={cardData?.cardholderName ?? ""}
          label="CARD_HOLDER_NAME"
          placeholder="FULL_NAME_ON_CARD"
          onChangeText={(text: string) => {
            resetError("name");
            dispatch({
              type: Actions.SET_CARD_DATA,
              payload: { cardholderName: text },
            });
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.name}
          errorText="REQUIRED"
          testID="cardHolderName"
        />
      </View>
      <CardInputGroup inputErrors={inputErrors} resetError={resetError} />
      <View style={styles.btn}>
        <SubmitButton
          label={SessionData?.mode === PaymentMode.Customer ? "SAVE" : "PAY"}
          labelSuffix={
            SessionData?.mode === PaymentMode.Customer
              ? ""
              : formatCurrency({
                  amount: SessionData?.amount,
                  currency: SessionData?.currency,
                })
          }
          onPress={onPay}
          testID="PayCTA"
        />
      </View>
    </View>
  );
};

export default CardSection;

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    flexGrow: 1,
  },
  cardNameContainer: {
    margin: responsiveScale(16),
    marginBottom: responsiveScale(8),
  },
  btn: {
    height: responsiveScale(60),
    marginBottom: responsiveScale(24),
  },
  inputStyle: {
    height: responsiveScale(50),
  },
});
