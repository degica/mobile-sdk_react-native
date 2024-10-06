import { useCallback, useContext } from "react";
import { Alert, Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { Actions, DispatchContext, StateContext } from "../context/state";
import { paymentFailedCtaText, paymentSuccessCtaText } from "../util/constants";
import { ResponseScreenStatuses } from "../util/types";

export const usePaymentUiUtils = (onDismiss?: () => void) => {
  const { t } = useTranslation();
  const { paymentState, paymentType, sessionData } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const closeSheet = useCallback(
    (showAlert = true, onClose: () => void) => {
      Keyboard.dismiss();

      if (showAlert) {
        Alert.alert(`${t("CANCEL_PAYMENT")}?`, "", [
          {
            text: t("NO"),
            style: "cancel",
          },
          {
            text: t("YES"),
            onPress: () => {
              onDismiss && onDismiss();
              onClose();
            },
          },
        ]);
      } else {
        onDismiss && onDismiss();
        onClose();
      }
    },
    [onDismiss, t]
  );

  const getCtaText = useCallback(() => {
    switch (paymentState) {
      case ResponseScreenStatuses.SUCCESS:
      case ResponseScreenStatuses.COMPLETE:
      case ResponseScreenStatuses.CANCELLED:
      case ResponseScreenStatuses.EXPIRED:
        return paymentSuccessCtaText;
      case ResponseScreenStatuses.FAILED:
        return paymentFailedCtaText;
      default:
        return "";
    }
  }, [paymentState]);

  const ctaOnPress = useCallback(
    (onClose: () => void) => {
      switch (paymentState) {
        case ResponseScreenStatuses.SUCCESS:
        case ResponseScreenStatuses.COMPLETE:
        case ResponseScreenStatuses.CANCELLED:
        case ResponseScreenStatuses.EXPIRED:
          return closeSheet(false, onClose);
        case ResponseScreenStatuses.FAILED:
          return dispatch({
            type: Actions.SET_PAYMENT_STATE,
            payload: "",
          });
        default:
          return "";
      }
    },
    [paymentState, dispatch, closeSheet]
  );

  const shouldShowAlert = useCallback(() => {
    return !(
      paymentState === ResponseScreenStatuses.SUCCESS ||
      paymentState === ResponseScreenStatuses.CANCELLED ||
      paymentState === ResponseScreenStatuses.COMPLETE ||
      paymentState === ResponseScreenStatuses.EXPIRED
    );
  }, [paymentState]);

  return {
    paymentState,
    paymentType,
    sessionData,
    closeSheet,
    getCtaText,
    ctaOnPress,
    shouldShowAlert,
  };
};
