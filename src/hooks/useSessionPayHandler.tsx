import { useContext } from "react";

import {
  CreatePaymentFuncType,
  PaymentMode,
  PaymentStatuses,
  sessionPayProps,
  TokenResponseStatuses,
} from "../util/types";
import { StateContext } from "../context/state";
import { openURL } from "../util/helpers";
import payForSession from "../services/payForSessionService";
import useMainStateUtils from "./useMainStateUtils";

const useSessionPayHandler = () => {
  const { sessionData, providerPropsData } = useContext(StateContext);
  const SessionData = sessionData as CreatePaymentFuncType;

  const {
    startLoading,
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
    startLoading();

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
