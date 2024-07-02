import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import Pill from "./Pill";
import { PaymentType, sessionShowPaymentMethodType } from "../util/types";
import { StateContext } from "../state";
import { BASE_URL } from "../util/constants";

type Props = {
  onSelect: (type: PaymentType) => void;
  selectedItem: PaymentType;
};

const PillContainer = ({ onSelect, selectedItem }: Props) => {
  const { paymentMethods } = useContext(StateContext);

  const getIcon = (slug: string) => {
    return (
      <SvgCssUri
        width={38}
        height={24}
        uri={`${BASE_URL}/payment_methods/${slug}.svg`}
      />
    );
  };

  const renderItem = ({ item }: { item: sessionShowPaymentMethodType }) => {
    return (
      <Pill
        isSelected={item.type === selectedItem}
        label={item.type}
        image={getIcon(item.type)}
        onPress={() => onSelect(item.type)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  contentContainer: {
    paddingLeft: 16,
  },
});

export default PillContainer;
