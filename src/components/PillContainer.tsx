import { useContext } from "react";

import { StyleSheet, View, Image, FlatList } from "react-native";

import { StateContext } from "../context/state";

import { PaymentType, sessionShowPaymentMethodType } from "../util/types";

import PaymentMethodImages from "../assets/images/paymentMethodImages";

import { responsiveScale } from "../theme/scalling";

import Pill from "./Pill";

type Props = {
  onSelect: (type: PaymentType) => void;
  selectedItem: PaymentType;
};

const PillContainer = ({ onSelect, selectedItem }: Props) => {
  const { paymentMethods } = useContext(StateContext);

  const getIcon = (slug: PaymentType) => {
    return <Image source={PaymentMethodImages[slug]} style={styles.image} />;
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
    marginBottom: responsiveScale(16),
  },
  contentContainer: {
    paddingLeft: responsiveScale(16),
  },
  image: {
    width: responsiveScale(38),
    height: responsiveScale(24),
    resizeMode: "contain",
  },
});

export default PillContainer;