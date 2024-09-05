import React, { MutableRefObject, useEffect } from 'react'
import { View, Text, AppState, AppStateStatus } from 'react-native'
import { KomojuProviderIprops, PaymentStatuses, TokenResponseStatuses } from '../util/types';
import sessionShow from '../services/sessionShow';


type Props = {
  props: KomojuProviderIprops,
  startLoading: () => void
  stopLoading: () => void
  sessionIdRef: MutableRefObject<string>
  onCompleteCallback: MutableRefObject<null>
  onPaymentSuccess: () => void
  onPaymentAwaiting: () => void
  onPaymentCancelled: () => void
  onSessionExpired: () => void
  onPaymentFailed: () => void
}

const useBackgroundHandler = ({
  props,
  startLoading,
  stopLoading,
  sessionIdRef,
  onCompleteCallback,
  onPaymentAwaiting,
  onPaymentCancelled,
  onPaymentFailed,
  onSessionExpired,
  onPaymentSuccess
}: Props) => {

  useEffect(() => {
    // Add event listener for deep links
    const windowChangeListener = AppState.addEventListener(
      "change",
      handleBackgroundStateChange
    );

    return () => {
      windowChangeListener.remove();
    };
  }, [props]);

  const handleBackgroundStateChange = async (status: AppStateStatus) => {
    startLoading();

    if (status === "active") {
      // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
      const sessionShowPayload = {
        publishableKey: props.publishableKey,
        sessionId: sessionIdRef.current,
      };

      // fetch session status to check if the payment is completed
      const sessionResponse = await sessionShow(sessionShowPayload);

      // if payment success showing success screen or if failed showing error screen
      if (sessionResponse?.status === PaymentStatuses.SUCCESS) {
        if (
          sessionResponse?.payment?.status === TokenResponseStatuses.CAPTURED
        ) {
          onPaymentSuccess();
        } else {
          onPaymentAwaiting();
        } // calling user passed onComplete method with session response data
        onCompleteCallback.current &&
          // TODO: Fix this type error
          // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
          onCompleteCallback.current(sessionResponse);
      } else if (
        sessionResponse?.payment?.status === PaymentStatuses.CANCELLED
      ) {
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
    }

    // after all api calls are done stopping the loading indicator
    stopLoading();
  };

  return undefined;
}

export default useBackgroundHandler