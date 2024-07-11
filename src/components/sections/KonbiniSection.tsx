import React, { useContext, useState, useCallback } from "react";

import { FlatList, StyleSheet, View } from "react-native";

import { SvgCssUri } from "react-native-svg/css";

import { Actions, DispatchContext, StateContext } from "@context/state";

import { formatCurrency, parseBrands } from "@util/helpers";
import {
  brandType,
  PaymentType,
  sessionShowPaymentMethodType,
} from "@util/types";
import { validateKonbiniFormFields } from "@util/validator";

import Input from "../Input";
import Pill from "../Pill";
import SubmitButton from "../SubmitButton";

const initialErrors = {
  name: false,
  email: false,
};

const KonbiniSection = (): JSX.Element => {
  const [inputErrors, setInputErrors] = useState(initialErrors);

  const {
    sessionPay,
    name,
    email,
    amount,
    currency,
    paymentMethods,
    selectedStore,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const konbiniPaymentMethodData = paymentMethods?.find(
    (method: sessionShowPaymentMethodType) =>
      method?.type === PaymentType.KONBINI
  );
  const konbiniBrands = parseBrands(konbiniPaymentMethodData?.brands || {});

  const onPay = () => {
    // TODO: Fix this type error
    // @ts-expect-error - Type 'string' is not assignable to type 'object'.
    const isValid = validateKonbiniFormFields({ name, email, setInputErrors });

    if (isValid) {
      sessionPay({
        paymentType: PaymentType.KONBINI,
        paymentDetails: {
          name,
          email,
          selectedStore,
        },
      });
    }
  };

  const resetError = (type: string) => {
    // TODO: Fix this type error
    // @ts-expect-error - Type 'string' cannot be used to index type 'object'.
    setInputErrors((pre: object) => ({ ...pre, [type]: false }));
  };

  const handlePillSelect = (type: string) => {
    dispatch({ type: Actions.SET_SELECTED_STORE, payload: type });
  };

  const shopImage = useCallback(
    (iconUrl: string) => {
      return <SvgCssUri width={38} height={24} uri={`${iconUrl}`} />;
    },
    [konbiniBrands]
  );

  const renderItem = ({ item }: { item: brandType }) => {
    const image = shopImage(item?.icon);

    return (
      <Pill
        isSelected={item.type === selectedStore}
        label={item.type}
        image={image}
        onPress={() => {
          handlePillSelect(item.type);
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Input
          value={name ?? ""}
          label="NAME_SHOWN_ON_RECEIPT"
          placeholder="FULL_NAME_ON_RECEIPT"
          onChangeText={(text: string) => {
            resetError("name");
            dispatch({ type: Actions.SET_NAME, payload: text });
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.name}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={email ?? ""}
          label="EMAIL"
          placeholder="EXAMPLE_EMAIL"
          onChangeText={(text: string) => {
            resetError("email");
            dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.email}
          inputMode="email"
        />
      </View>
      <View style={styles.shopListContainer}>
        <FlatList
          data={konbiniBrands}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
      <SubmitButton
        label="PAY"
        labelSuffix={formatCurrency({ amount, currency })}
        onPress={onPay}
      />
    </View>
  );
};

export default KonbiniSection;

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    flex: 1,
  },
  inputContainer: {
    margin: 16,
    marginBottom: 24,
    height: 60,
  },
  inputStyle: {
    height: 50,
  },
  shopListContainer: {
    marginBottom: 26,
    marginTop: 16,
  },
  contentContainer: {
    paddingLeft: 16,
  },
  iconStyle: {
    width: 32,
    height: 32,
  },
});
