import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  onPress: () => void;
  label: string;
  testID?: string;
};

const SubmitButton = ({ label, onPress, testID }: Props) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={styles.buttonWrapper}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: "#0B82EE",
    borderRadius: 8,
    height: 50,
    minHeight: 50,
    marginHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
