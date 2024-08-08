import React, { Dispatch, SetStateAction, useContext } from "react";

import {
  TouchableOpacity,
  Modal,
  View,
  Image,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";

import { t } from "i18next";

import { Actions, DispatchContext, StateContext } from "@context/state";
import { useTheme } from "@context/ThemeContext";

import {
  paymentFailedCtaText,
  paymentSuccessCtaText,
  ThemeModes,
} from "@util/constants";
import { ResponseScreenStatuses, ThemeSchemeType } from "@util/types";

import closeIcon from "@assets/images/close.png";
import closeDMIcon from "@assets/images/close_dm.png";

import { resizeFonts, responsiveScale, WINDOW_HEIGHT } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

import KomojuText from "./KomojuText";
import ResponseScreen from "./ResponseScreen";
import SheetContent from "./SheetContent";

type PaymentModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onDismiss?: () => void;
};

const PaymentModal = ({
  modalVisible,
  setModalVisible,
  onDismiss,
}: PaymentModalProps) => {
  const { paymentState } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const theme = useCurrentTheme();
  const styles = getStyles(theme);
  const { mode } = useTheme();

  const closeSheet = (showAlert = true) => {
    Keyboard.dismiss();

    if (showAlert) {
      // showing an alert when user try to close the SDK modal
      Alert.alert(`${t("CANCEL_PAYMENT")}?`, "", [
        {
          text: t("NO"),
          style: "cancel",
        },
        {
          text: t("YES"),
          onPress: () => {
            // invoking client provided onDismiss() callback when closing the SDK modal
            onDismiss && onDismiss();
            setModalVisible(false);
          },
        },
      ]);
    } else {
      // invoking client provided callback when closing the SDK modal
      onDismiss && onDismiss();
      setModalVisible(false);
    }
  };

  const getCtaText = () => {
    switch (paymentState) {
      case ResponseScreenStatuses.SUCCESS:
        return paymentSuccessCtaText;
      case ResponseScreenStatuses.FAILED:
        return paymentFailedCtaText;
      default:
        return "";
    }
  };

  const ctaOnPress = () => {
    switch (paymentState) {
      case ResponseScreenStatuses.SUCCESS:
        return closeSheet(false);
      case ResponseScreenStatuses.FAILED:
        return dispatch({
          type: Actions.SET_PAYMENT_STATE,
          payload: "",
        });
      default:
        return "";
    }
  };

  const onCloseModal = () => {
    closeSheet(
      !(
        paymentState === ResponseScreenStatuses.SUCCESS ||
        // TODO: Fix this type error
        // @ts-expect-error - Property 'COMPLETE' does not exist on type 'ResponseScreenStatuses'.
        paymentState === ResponseScreenStatuses.COMPLETE
      )
    );
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="overFullScreen"
      visible={modalVisible}
      onRequestClose={onCloseModal}
    >
      <TouchableOpacity onPress={onCloseModal} style={styles.container} />

      <View style={styles.bottomSheetContainer}>
        <View style={styles.line}>
          <KomojuText style={styles.headerLabel}>PAYMENT_OPTIONS</KomojuText>
          <TouchableOpacity style={styles.crossBtn} onPress={onCloseModal}>
            <Image
              source={mode === ThemeModes.light ? closeIcon : closeDMIcon}
            />
          </TouchableOpacity>
        </View>
        {
          // TODO: Fix this type error
          // @ts-expect-error - Property 'COMPLETE' does not exist on type 'ResponseScreenStatuses'.
          paymentState && paymentState !== ResponseScreenStatuses.COMPLETE ? (
            <ResponseScreen
              status={paymentState}
              onPress={ctaOnPress}
              onPressLabel={getCtaText()}
            />
          ) : (
            <SheetContent />
          )
        }
      </View>
    </Modal>
  );
};

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.WHITE50,
    },
    bottomSheetContainer: {
      height: WINDOW_HEIGHT - 85,
      width: "100%",
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    line: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: responsiveScale(20),
      marginHorizontal: responsiveScale(16),
    },
    headerLabel: {
      fontSize: resizeFonts(18),
      fontWeight: "bold",
      flex: 1,
      alignItems: "center",
      textAlign: "center",
      color: theme.TEXT_COLOR,
    },
    crossBtn: {
      position: "absolute",
      right: 0,
      padding: responsiveScale(10),
      fontSize: resizeFonts(16),
    },
  });
};

export default PaymentModal;
