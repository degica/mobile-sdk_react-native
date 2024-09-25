import { useContext, useEffect } from "react";

import {
  CreatePaymentFuncType,
  PaymentMode,
  PaymentStatuses,
  sessionPayProps,
  TokenResponseStatuses,
} from "../util/types";
import { StateContext, KomojuContext } from "../context/state";
import { openURL } from "../util/helpers";
import payForSession from "../services/payForSessionService";
import useMainStateUtils from "./useMainStateUtils";

let timeoutId: NodeJS.Timeout;

const useSessionPayHandler = () => {
  const { sessionData, providerPropsData } = useContext(StateContext);
  const { closePaymentSheet } = useContext(KomojuContext);

  const SessionData = sessionData as CreatePaymentFuncType;

  useEffect(() => {
    () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const {
    startPaymentLoading,
    stopLoading,
    onPaymentAwaiting,
    onPaymentFailed,
    onPaymentSuccess,
  } = useMainStateUtils();

  // Session pay callback. this method handles all the payment logic and APIs
  const sessionPay = async ({
    paymentType,
    paymentDetails,
  }: sessionPayProps) => {
    // Start of the payment handling method
    startPaymentLoading();

    // initiate payment for the session ID with payment details
    const response = await payForSession({
      paymentType,
      sessionId: SessionData?.sessionId,
      publishableKey: providerPropsData.publishableKey,
      paymentDetails,
    });

    stopLoading();

    if (response?.status === PaymentStatuses.PENDING) {
      openURL(response.redirect_url);
    } else if (response?.status === PaymentStatuses.SUCCESS) {
      if (
        response?.payment?.status === TokenResponseStatuses.CAPTURED ||
        response?.customer?.resource === PaymentMode.Customer
      ) {
        onPaymentSuccess();
        if (response?.customer?.resource === PaymentMode.Customer) {
          timeoutId = setTimeout(() => closePaymentSheet(), 2000);
        }
      } else if (response?.payment?.payment_details?.instructions_url) {
        openURL(response?.payment?.payment_details?.instructions_url);
        onPaymentAwaiting();
      }
    } else {
      onPaymentFailed();
    }
  };

  return {
    sessionPay,
  };
};

export default useSessionPayHandler;
