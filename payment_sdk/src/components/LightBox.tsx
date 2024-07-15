import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useTranslation } from "react-i18next";

type Props = {
  content: string;
  icon?: string;
};

const LightBox = ({ content, icon }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{icon && <Text>{icon}</Text>}</View>
      <Text style={styles.content}>{t(content)}</Text>
    </View>
  );
};

export default LightBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#F3F7F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 16,
    color: "#172E44",
    flex: 0.9,
  },
  iconWrapper: {
    marginRight: 8,
    borderRadius: 100,
    backgroundColor: "white",
    padding: 8,
  },
});
