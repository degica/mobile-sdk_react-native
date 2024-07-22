import React from "react";

import { Image, StyleSheet, View } from "react-native";

import { useTheme } from "@context/ThemeContext";

import { ThemeModes } from "@util/constants";

import FirstFooterImage from "@assets/images/footer_image1.png";
import SecondFooterImage from "@assets/images/footer_image2.png";
import SecondFooterImageDM from "@assets/images/footer_image2_dm.png";

import { responsiveScale } from "@theme/scalling";

const SheetFooter = () => {
  const { mode } = useTheme();
  return (
    <View style={styles.container}>
      <Image source={FirstFooterImage} />
      <Image source={mode === ThemeModes.dark ? SecondFooterImageDM : SecondFooterImage} />
    </View>
  );
};

export default SheetFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: responsiveScale(16),
  },
});
