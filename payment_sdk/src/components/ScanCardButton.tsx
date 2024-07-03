import { Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import KomojuText from "./KomojuText";

// When press the scan card button it will open the camera and scan the card,
// without manually typing the card number, this will automaticaly fill in the
// card field

type ScanCardButtonProps = {
  onPress: () => void;
};

const ScanCardButton = ({onPress}: ScanCardButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.scanIconRow}
      onPress={onPress}
    >
      <Image
        style={styles.cardScan}
        source={require("../assets/images/scan.png")}
      />
      <KomojuText style={styles.label}>SCAN_CARD</KomojuText>
    </TouchableOpacity>
  );
};

export default ScanCardButton;

const styles = StyleSheet.create({
  cardScan: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  scanIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#172E44",
  },
});
