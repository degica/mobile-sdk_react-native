import React, { useContext, useState } from "react";

import { StyleSheet, View } from "react-native";

import { StateContext } from "@context/state";

import Input from "@components/Input";

import { LangKeys } from "@util/constants";
import { PaymentType } from "@util/types";
import { validatePaidyFormFields } from "@util/validator";

import { responsiveScale } from "@theme/scalling";

import SubmitButton from "../SubmitButton";

type PaidyFormSectionProps = {
  type: PaymentType;
};

const PaidyFormSection = ({ type }: PaidyFormSectionProps) => {
  const [inputValues, setInputValues] = useState({ name: "", phone: "" });
  const [inputErrors, setInputErrors] = useState({ name: false, phone: false });

  const { sessionPay } = useContext(StateContext);

  const onPay = () => {
    const isValid = validatePaidyFormFields({
      ...inputValues,
      // @ts-expect-error - Type 'string' cannot be used to index type 'object'.
      setInputErrors,
    });
    if (isValid) {
      sessionPay({
        paymentType: type,
        paymentDetails: {
          ...inputValues,
        },
      });
    }
  };

  const onNameChange = (text: string) => {
    setInputErrors((pre) => ({ ...pre, name: false }));
    setInputValues((pre) => ({ ...pre, name: text }));
  };

  const onPhoneChange = (text: string) => {
    setInputErrors((pre) => ({ ...pre, phone: false }));
    setInputValues((pre) => ({ ...pre, phone: text }));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Input
          value={inputValues.name}
          label="FULL_NAME"
          placeholder="FULL_NAME_PLACEHOLDER"
          onChangeText={onNameChange}
          inputStyle={styles.inputStyle}
          error={inputErrors.name}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={inputValues.phone}
          label="TELEPHONE_NUMBER"
          placeholder="TELEPHONE_NUMBER_PLACEHOLDER"
          onChangeText={onPhoneChange}
          inputStyle={styles.inputStyle}
          error={inputErrors.phone}
        />
      </View>
      <View style={styles.btn}>
        <SubmitButton onPress={onPay} label={`CONTINUE_TO_${LangKeys[type]}`} />
      </View>
    </View>
  );
};

export default PaidyFormSection;

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    flex: 1,
  },
  inputContainer: {
    margin: responsiveScale(16),
    marginBottom: responsiveScale(24),
    height: responsiveScale(60),
  },
  inputStyle: {
    height: responsiveScale(50),
  },
  btn: {
    height: responsiveScale(60),
    marginTop: responsiveScale(24),
  },
});
