import { useContext, useState, useCallback } from "react";

import { FlatList, StyleSheet, Image, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "../../context/state";

import { formatCurrency, parseBrands } from "../../util/helpers";
import {
  brandType,
  KonbiniType,
  PaymentType,
  sessionDataType,
  sessionShowPaymentMethodType,
} from "../../util/types";
import { validateKonbiniFormFields } from "../../util/validator";

import KonbiniImages from "../../assets/images/konbiniImages";

import { responsiveScale } from "../../theme/scalling";

import Input from "../Input";
import Pill from "../Pill";
import SubmitButton from "../SubmitButton";
import useSessionPayHandler from "../../hooks/useSessionPayHandler";

const initialErrors = {
  name: false,
  email: false,
};

const KonbiniSection = (): JSX.Element => {
  const [inputErrors, setInputErrors] = useState(initialErrors);

  const { sessionPay } = useSessionPayHandler();
  const { name, email, sessionData, selectedStore } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const SessionData = sessionData as sessionDataType;

  const konbiniPaymentMethodData = SessionData?.paymentMethods?.find(
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
    (icon: KonbiniType) => {
      return <Image source={KonbiniImages[icon]} style={styles.image} />;
    },
    [konbiniBrands]
  );

  const renderItem = ({ item }: { item: brandType }) => {
    const image = shopImage(item?.type);

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
          errorText="REQUIRED"
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={email ?? ""}
          label="EMAIL"
          placeholder="EXAMPLE_EMAIL"
          autoCapitalize="none"
          onChangeText={(text: string) => {
            resetError("email");
            dispatch({ type: Actions.SET_EMAIL, payload: text });
          }}
          inputStyle={styles.inputStyle}
          error={inputErrors.email}
          errorText="EMAIL_ERROR"
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
      <View style={styles.btn}>
        <SubmitButton
          label="PAY"
          labelSuffix={formatCurrency({
            amount: SessionData?.amount,
            currency: SessionData?.currency,
          })}
          onPress={onPay}
        />
      </View>
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
    margin: responsiveScale(16),
    marginBottom: responsiveScale(8),
  },
  inputStyle: {
    height: responsiveScale(50),
  },
  shopListContainer: {
    marginBottom: responsiveScale(26),
    marginTop: responsiveScale(16),
  },
  contentContainer: {
    paddingLeft: responsiveScale(16),
  },
  iconStyle: {
    width: responsiveScale(32),
    height: responsiveScale(32),
  },
  btn: {
    height: responsiveScale(60),
    marginBottom: responsiveScale(24),
  },
  image: {
    width: responsiveScale(38),
    height: responsiveScale(24),
    resizeMode: "contain",
  },
});
