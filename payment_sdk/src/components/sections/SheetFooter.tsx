import React from "react";

import { Image, StyleSheet, View } from "react-native";

import FirstFooterImage from "@assets/images/footer_image1.png";
import SecondFooterImage from "@assets/images/footer_image2.png";

const SheetFooter = () => {
  return (
    <View style={styles.container}>
      <Image source={FirstFooterImage} />
      <Image source={SecondFooterImage} />
    </View>
  );
};

export default SheetFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
});
