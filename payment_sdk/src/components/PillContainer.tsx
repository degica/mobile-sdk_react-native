import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import Pill from "./Pill";
import { PaymentType } from "../util/types";

type Props = {
  onSelect: (type: PaymentType) => void;
  selectedItem: PaymentType;
};

type itemType = {
  label: string;
  id: PaymentType;
  icon: string;
  color: string;
};

const options = [
  {
    label: "Credit Card",
    id: PaymentType.CREDIT,
    icon: require("../assets/images/cc.png"),
    color: "#e0e0e0",
  },
  {
    label: "Konbini",
    id: PaymentType.KONBINI,
    icon: require("../assets/images/shop.png"),
    color: "#a5d6a7",
  },
  {
    label: "Paypay",
    id: PaymentType.PAY_PAY,
    icon: require("../assets/images/paypay.png"),
    color: "#ef9a9a",
  },
];

const PillContainer = ({ onSelect, selectedItem }: Props) => {
  const renderItem = ({ item }: { item: itemType }) => {
    return (
      <Pill
        isSelected={item.id === selectedItem}
        label={item.label}
        icon={item.icon}
        onPress={() => onSelect(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
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
