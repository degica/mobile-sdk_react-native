import React, { useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import Input from "../Input";
import SubmitButton from "../SubmitButton";
import { formatCurrency } from "../../util/helpers";
import { Actions, DispatchContext, StateContext } from "../../state";
import { brandType, KonbiniStoreNames, PaymentType } from "../../util/types";
import { validateKonbiniFormFields } from "../../util/validator";
import Pill from "../Pill";
import { BASE_URL } from "../../util/constants";

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
    konbiniBrands,
    selectedStore,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const onPay = () => {
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
    setInputErrors((pre: object) => ({ ...pre, [type]: false }));
  };

  const handlePillSelect = (type: string) => {
    dispatch({ type: Actions.SET_SELECTED_STORE, payload: type });
  };

  const renderItem = ({ item }: { item: brandType }) => {
    const shopImage = (
      <SvgCssUri width={38} height={24} uri={`${BASE_URL}${item.icon}`} />
    );

    return (
      <Pill
        isSelected={item.type === selectedStore}
        label={KonbiniStoreNames[item.type]}
        image={shopImage}
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
          value={name}
          label="Name (shown on receipt)"
          placeholder="Full name on receipt"
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
          value={email}
          label="Email"
          placeholder="example@email.com"
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
        label={`Pay ${formatCurrency({ amount, currency })}`}
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
