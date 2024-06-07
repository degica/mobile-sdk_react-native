import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Input from "../Input";
import CardInputGroup from "../CardInputGroup";
import SubmitButton from "../SubmitButton";
import { Actions, DispatchContext, StateContext } from "../../state";
import { PaymentType } from "../../util/types";
import { formatCurrency } from "../../util/helpers";

type Props = {};

/**
 * CardSection component for displaying and handling the card payment form.
 * @param {Props} props - The props for the CardSection component.
 * @returns {JSX.Element} The CardSection component.
 */

const CardSection = (props: Props) => {
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

  const onPay = () => {
    sessionPay({
      paymentType: PaymentType.CREDIT,
      cardDetails: { cardholderName, cardCVV, cardNumber, cardExpiredDate },
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardNameContainer}>
        <Input
          value={cardholderName}
          label="Cardholder name"
          placeholder="Full name on card"
          onChangeText={(text: string) => {
            dispatch({ type: Actions.SET_CARDHOLDER_NAME, payload: text });
          }}
          hasBorder
          inputStyle={styles.inputStyle}
          testID="cardHolderName"
        />
      </View>
      <CardInputGroup />
      <SubmitButton
        label={`Pay ${formatCurrency({ amount, currency })}`}
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
