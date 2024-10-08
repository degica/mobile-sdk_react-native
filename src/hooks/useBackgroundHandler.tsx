import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  CreatePaymentFuncType,
  PaymentMode,
  PaymentStatuses,
  PaymentType,
  TokenResponseStatuses,
} from "../util/types";
import sessionShow from "../services/sessionShow";
import { StateContext } from "../context/state";
import { getTokenResult } from "../services/secureTokenService";
import payForSession from "../services/payForSessionService";
import useMainStateUtils from "./useMainStateUtils";

let timeoutId: NodeJS.Timeout;

const useBackgroundHandler = (
  isDeepLinkOpened: boolean,
  setIsDeepLinkOpened: Dispatch<SetStateAction<boolean>>,
  closePaymentSheet: () => void
) => {
  const { paymentType, tokenId, providerPropsData, sessionData } =
    useContext(StateContext);

  const SessionData = sessionData as CreatePaymentFuncType;

  const {
    startPaymentLoading,
    stopLoading,
    onPaymentAwaiting,
    onPaymentCancelled,
    onSessionExpired,
    onPaymentFailed,
    onPaymentSuccess,
  } = useMainStateUtils();

  useEffect(() => {
    // Add event listener background state change
    const windowChangeListener = AppState.addEventListener(
      "change",
      handleBackgroundStateChange
    );

    return () => {
      windowChangeListener.remove();
    };
  }, [providerPropsData, paymentType, tokenId, SessionData, isDeepLinkOpened]);

  useEffect(() => {
    () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleSessionPaymentResponse = async () => {
    // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
    const sessionShowPayload = {
      publishableKey: providerPropsData.publishableKey,
      sessionId: SessionData?.sessionId,
    };

    // fetch session status to check if the payment is completed
    const sessionResponse = await sessionShow(sessionShowPayload);

    // if payment success showing success screen or if failed showing error screen
    if (sessionResponse?.status === PaymentStatuses.SUCCESS) {
      if (
        sessionResponse?.payment?.status === TokenResponseStatuses.CAPTURED ||
        sessionResponse.mode === PaymentMode.Customer
      ) {
        onPaymentSuccess();
        if (sessionResponse.mode === PaymentMode.Customer) {
          timeoutId = setTimeout(() => closePaymentSheet(), 2000);
        }
      } else {
        onPaymentAwaiting();
      } // calling user passed onComplete method with session response data
      SessionData?.onComplete && SessionData?.onComplete(sessionResponse);
    } else if (sessionResponse?.payment?.status === PaymentStatuses.CANCELLED) {
      onPaymentCancelled();
    } else if (sessionResponse?.expired) {
      onSessionExpired();
    } else if (
      sessionResponse?.status === PaymentStatuses.ERROR ||
      sessionResponse?.payment?.status === PaymentStatuses.ERROR ||
      sessionResponse?.secure_token?.verification_status ===
        TokenResponseStatuses.ERROR
    ) {
      onPaymentFailed();
    }
  };

  const handleSecureTokenPaymentResponse = async () => {
    const tokenResponse = await getTokenResult({
      publishableKey: providerPropsData.publishableKey,
      tokenId: tokenId,
    });

    if (
      tokenResponse?.verification_status === TokenResponseStatuses.SUCCESS ||
      tokenResponse?.verification_status === TokenResponseStatuses.SKIPPED
    ) {
      const paymentResponse = await payForSession({
        paymentType: PaymentType.CREDIT,
        sessionId: SessionData?.sessionId,
        publishableKey: providerPropsData.publishableKey,
        paymentDetails: { tokenId: tokenId },
      });

      if (paymentResponse?.status === PaymentStatuses.SUCCESS) {
        onPaymentSuccess();
      } else {
        onPaymentFailed();
      }
    } else if (
      tokenResponse?.verification_status === TokenResponseStatuses.ERROR
    ) {
      onPaymentFailed();
    }
  };

  const handleBackgroundStateChange = async (status: AppStateStatus) => {
    if (status === "active" && !isDeepLinkOpened) {
      startPaymentLoading();

      if (paymentType === PaymentType.CREDIT) {
        await handleSecureTokenPaymentResponse();
      } else {
        await handleSessionPaymentResponse();
      }
      // after all api calls are done stopping the loading indicator
      stopLoading();
    }

    // Reset the deep link flag when app state changes
    if (status === "background" || status === "inactive") {
      setIsDeepLinkOpened(false);
    }
  };

  return undefined;
};

export default useBackgroundHandler;
