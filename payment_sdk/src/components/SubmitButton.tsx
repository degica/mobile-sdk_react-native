import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onPress: () => void;
  label: string;
  labelSuffix?: string;
  testID?: string;
};

const SubmitButton = ({ label, labelSuffix, onPress, testID }: Props) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      testID={testID}
      style={styles.buttonWrapper}
      onPress={onPress}
    >
      <Text style={styles.label}>
        {labelSuffix ? `${t(label)} ${labelSuffix}` : t(label)}
      </Text>
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
