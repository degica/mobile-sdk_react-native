import React, { useContext, useState } from "react";

import { StyleSheet, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "@context/state";

import Input from "@components/Input";

import { formatCurrency, generateInitialErrors } from "@util/helpers";
import { TransferPaymentScheme } from "@util/payment-scheme";
import { FormStateType, PaymentType } from "@util/types";
import { validateTransferFormFields } from "@util/validator";

import { responsiveScale } from "@theme/scalling";

import SubmitButton from "../SubmitButton";

type TransferFormSectionProps = {
  type: PaymentType;
};

const TransferFormSection = ({ type }: TransferFormSectionProps) => {
  const initialErrors = generateInitialErrors(TransferPaymentScheme);
  const dispatch = useContext(DispatchContext);
  const [inputErrors, setInputErrors] =
    useState<FormStateType>(initialErrors);

  const { sessionPay, amount, currency, transferFormFields } =
    useContext(StateContext);

  const onPay = () => {
    const isValid = validateTransferFormFields({
      ...transferFormFields,
      setInputErrors,
    });

    if (isValid) {
      sessionPay({
        paymentType: type,
        paymentDetails: {
          ...transferFormFields,
        },
      });
    }
  };

  const resetError = (typeKey: keyof typeof initialErrors) => {
    setInputErrors((pre) => ({ ...pre, [typeKey]: false }));
  };

  const changeTextHandler = (
    text: string,
    typeKey: keyof typeof initialErrors
  ) => {
    resetError(typeKey);
    const copyOfTransferFormFields = { ...transferFormFields };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    copyOfTransferFormFields[typeKey]  = text;
    dispatch({
      type: Actions.SET_TRANSFER_FORM_FIELDS,
      payload: copyOfTransferFormFields,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.lastName || ""}
          label="LAST_NAME"
          placeholder="LAST_NAME"
          onChangeText={(text: string) => {
            changeTextHandler(text, "lastName");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.lastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.firstName || ""}
          label="FIRST_NAME"
          placeholder="FIRST_NAME"
          onChangeText={(text: string) => {
            changeTextHandler(text, "firstName");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.firstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.lastNamePhonetic || ""}
          label="LAST_NAME_PHONETIC"
          placeholder="LAST_NAME_PHONETIC"
          onChangeText={(text: string) => {
            changeTextHandler(text, "lastNamePhonetic");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.lastNamePhonetic}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.firstNamePhonetic || ""}
          label="FIRST_NAME_PHONETIC"
          placeholder="FIRST_NAME_PHONETIC"
          onChangeText={(text: string) => {
            changeTextHandler(text, "firstNamePhonetic");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.firstNamePhonetic}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.email || ""}
          autoCapitalize="none"
          label="EMAIL"
          placeholder="EXAMPLE_EMAIL"
          onChangeText={(text: string) => {
            changeTextHandler(text, "email");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.email}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={transferFormFields?.phone || ""}
          label="TELEPHONE_NUMBER"
          placeholder="TELEPHONE_NUMBER_PLACEHOLDER"
          onChangeText={(text: string) => {
            changeTextHandler(text, "phone");
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.phone}
        />
      </View>
      <View style={styles.btn}>
        <SubmitButton
          label="PAY"
          labelSuffix={formatCurrency({ amount, currency })}
          onPress={onPay}
          testID="PayCTA"
        />
      </View>
    </View>
  );
};

export default TransferFormSection;

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
    marginVertical: responsiveScale(24),
  },
});
