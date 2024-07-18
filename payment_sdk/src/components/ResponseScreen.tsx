import React, { useCallback, useMemo } from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { ResponseScreenStatuses, ThemeSchemeType } from "@util/types";

import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

import SubmitButton from "./SubmitButton";

type Props = {
  status: ResponseScreenStatuses.SUCCESS | ResponseScreenStatuses.FAILED;
  message?: string;
  onPressLabel: string;
  onPress: () => void;
};

const ResponseScreen = ({ status, message, onPress, onPressLabel }: Props) => {

  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  const renderMessageContent = useMemo(() => {
    const title =
      status === ResponseScreenStatuses.SUCCESS
        ? "Payment Success"
        : "Payment Failed";
    const defaultMessage =
      status === ResponseScreenStatuses.SUCCESS
        ? "Thank you for your order"
        : "Hey there, We tried to charge your card but, something went wrong. Please update your payment method below to continue";
    const msg = message || defaultMessage;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{msg}</Text>
      </View>
    );
  }, [status, message]);

  const renderIcon = useMemo(() => {
    const source =
      status === ResponseScreenStatuses.SUCCESS
        ? require("../assets/images/success.png")
        : require("../assets/images/error.png");
    return <Image source={source} style={styles.icon} />;
  }, [status]);

  const memoizedOnPress = useCallback(onPress, [onPress]);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.imageContainer}>{renderIcon}</View>
      {renderMessageContent}
      <View style={styles.bottomButton}>
        <SubmitButton onPress={memoizedOnPress} label={onPressLabel} />
      </View>
    </View>
  );
};

export default ResponseScreen;

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    parentContainer: {
      flex: 1,
    },
    container: {
      padding: responsiveScale(16),
      alignItems: "center",
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: responsiveScale(18),
    },
    icon: {
      width: responsiveScale(48),
      height: responsiveScale(48),
    },
    title: {
      fontSize: resizeFonts(28),
      fontWeight: "bold",
      marginBottom: responsiveScale(16),
      color: theme.TEXT_COLOR,
    },
    message: {
      fontSize: resizeFonts(16),
      marginBottom: responsiveScale(16),
      textAlign: "center",
      paddingHorizontal: responsiveScale(32),
    },
    bottomButton: {
      position: "absolute",
      bottom: responsiveScale(42),
      left: 0,
      right: 0,
    },
  });

}