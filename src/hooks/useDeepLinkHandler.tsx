import { Linking } from "react-native";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
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
import { extractParameterFromUrl } from "../util/helpers";
import payForSession from "../services/payForSessionService";
import useMainStateUtils from "./useMainStateUtils";

const useDeepLinkHandler = (
  setIsDeepLinkOpened: Dispatch<SetStateAction<boolean>>
) => {
  const { paymentType, providerPropsData, sessionData } =
    useContext(StateContext);
  const SessionData = sessionData as CreatePaymentFuncType;

  const {
    startLoading,
    stopLoading,
    onPaymentAwaiting,
    onPaymentCancelled,
    onPaymentFailed,
    onPaymentSuccess,
  } = useMainStateUtils();

  useEffect(() => {
    // Add event listener for deep links
    const subscription = Linking.addEventListener(
      "url",
      handleDeepLinkStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [paymentType, providerPropsData, sessionData]);

  const handleSessionPaymentResponse = async () => {
    startLoading();

    // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
    const sessionShowPayload = {
      publishableKey: providerPropsData.publishableKey,
      sessionId: SessionData?.sessionId,
    };

    // fetch session status to check if the payment is completed
    let sessionResponse = await sessionShow(sessionShowPayload);

    // Polling until session verification status changes
    while (
      sessionResponse?.status === PaymentStatuses.PENDING &&
      sessionResponse?.payment?.status !== PaymentStatuses.CANCELLED &&
      sessionResponse?.secure_token?.verification_status !==
        TokenResponseStatuses.ERROR
    ) {
      sessionResponse = await sessionShow(sessionShowPayload);
    }

    // if payment success showing success screen or if failed showing error screen
    if (sessionResponse?.status === PaymentStatuses.SUCCESS) {
      if (
        sessionResponse?.payment?.status === TokenResponseStatuses.CAPTURED ||
        sessionResponse.mode === PaymentMode.Customer
      ) {
        onPaymentSuccess();
      } else {
        onPaymentAwaiting();
      }
      // calling user passed onComplete method with session response data
      SessionData?.onComplete && SessionData?.onComplete(sessionResponse);
    } else if (sessionResponse?.payment?.status === PaymentStatuses.CANCELLED) {
      onPaymentCancelled();
    } else {
      onPaymentFailed();
    }

    // after all api calls are done stopping the loading indicator
    stopLoading();
  };

  const handleSecureTokenPaymentResponse = async (token: string) => {
    startLoading();

    const tokenResponse = await getTokenResult({
      publishableKey: providerPropsData.publishableKey,
      tokenId: token,
    });

    if (
      tokenResponse?.verification_status === TokenResponseStatuses.SUCCESS ||
      tokenResponse?.verification_status === TokenResponseStatuses.SKIPPED
    ) {
      const paymentResponse = await payForSession({
        paymentType: PaymentType.CREDIT,
        sessionId: SessionData?.sessionId,
        publishableKey: providerPropsData.publishableKey,
        paymentDetails: { tokenId: token },
      });

      if (paymentResponse?.status === PaymentStatuses.SUCCESS) {
        onPaymentSuccess();
      } else {
        onPaymentFailed();
      }

      stopLoading();
    } else {
      onPaymentFailed();
      stopLoading();
    }
  };

  const handleDeepLinkStateChange = async ({ url }: { url: string }) => {
    setIsDeepLinkOpened(true);
    if (paymentType === PaymentType.CREDIT) {
      const token = extractParameterFromUrl(url, "secure_token_id");
      handleSecureTokenPaymentResponse(token);
    } else {
      handleSessionPaymentResponse();
    }
  };

  return undefined;
};

export default useDeepLinkHandler;
