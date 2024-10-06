import { useContext, useState } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "../../context/state";

import Input from "../../components/Input";

import { LangKeys } from "../../util/constants";
import { formatCurrency } from "../../util/helpers";
import { PaymentType, sessionDataType } from "../../util/types";

import { responsiveScale } from "../../theme/scalling";

import SubmitButton from "../SubmitButton";
import useSessionPayHandler from "../../hooks/useSessionPayHandler";

type SingleInputFormSectionProps = {
  type: PaymentType;
};

const SingleInputFormSection = ({ type }: SingleInputFormSectionProps) => {
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState(false);
  const { sessionData } = useContext(StateContext) as {
    sessionData: sessionDataType;
  };
  const { sessionPay } = useSessionPayHandler();

  const onPay = () => {
    if (!inputText) {
      setInputError(true);
    } else {
      sessionPay({
        paymentType: type,
        paymentDetails: {
          singleInput: inputText,
        },
      });
    }
  };

  const changeTextHandler = (text: string) => {
    setInputError(false);
    setInputText(text);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardNameContainer}>
        <Input
          value={inputText}
          label={`${LangKeys[type]}_INPUT_LABEL`}
          placeholder={`${LangKeys[type]}_INPUT_PLACEHOLDER`}
          onChangeText={changeTextHandler}
          inputStyle={styles.inputStyle}
          error={inputError}
        />
      </View>
      <View style={styles.btn}>
        <SubmitButton
          label="PAY"
          labelSuffix={formatCurrency({
            amount: sessionData.amount,
            currency: sessionData.currency,
          })}
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
