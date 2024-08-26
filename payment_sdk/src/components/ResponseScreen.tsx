import React, { useCallback, useMemo } from "react";
import { Image, StyleSheet, View, ImageSourcePropType } from "react-native";
import { ResponseScreenStatuses, ThemeSchemeType } from "@util/types";
import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";
import KomojuText from "./KomojuText";
import SubmitButton from "./SubmitButton";

type StatusConfig = {
  title: string;
  defaultMessage: string;
  image: ImageSourcePropType;
};

// Configuration object for all statuses
const statusConfigs: Partial<Record<ResponseScreenStatuses, StatusConfig>> = {
  [ResponseScreenStatuses.SUCCESS]: {
    title: "PAYMENT_SUCCESS",
    defaultMessage: "ORDER_THANK_YOU_NOTE",
    image: require("../assets/images/success.png"),
  },
  [ResponseScreenStatuses.FAILED]: {
    title: "PAYMENT_FAILED",
    defaultMessage: "PAYMENT_RE_TRY_MSG",
    image: require("../assets/images/error.png"),
  },
  [ResponseScreenStatuses.CANCELLED]: {
    title: "PAYMENT_CANCELLED",
    defaultMessage: "PAYMENT_CANCELLED_MSG",
    image: require("../assets/images/error.png"),
  },
  [ResponseScreenStatuses.COMPLETE]: {
    title: "PAYMENT_WAITING",
    defaultMessage: "PAYMENT_CANCELLED_MSG",
    image: require("../assets/images/awaitingPayment.png"),
  },
};

type Props = {
  status: ResponseScreenStatuses;
  message?: string;
  onPressLabel: string;
  onPress: () => void;
};

const ResponseScreen = ({ status, message, onPress, onPressLabel }: Props) => {
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  const statusConfig = statusConfigs[status];

  const renderMessageContent = useMemo(() => {
    const msg = message || statusConfig?.defaultMessage;

    return (
      <View style={styles.container}>
        <KomojuText style={styles.title}>{statusConfig?.title}</KomojuText>
        <KomojuText style={styles.message}>{msg}</KomojuText>
      </View>
    );
  }, [status, message, statusConfig]);

  const renderIcon = useMemo(() => {
    return <Image source={statusConfig?.image} style={styles.icon} />;
  }, [statusConfig]);

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
};
