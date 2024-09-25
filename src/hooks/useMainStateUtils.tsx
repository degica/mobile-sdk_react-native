import { useContext, useEffect } from "react";

import { Actions, DispatchContext, StateContext } from "../context/state";
import {
  ResponseScreenStatuses,
  CreatePaymentFuncType,
  sessionDataType,
  PaymentMode,
} from "../util/types";
import sessionShow from "../services/sessionShow";
import { getInitialStateWithoutProviderPropsData } from "../util/helpers";

let timeoutId: NodeJS.Timeout;

const useMainStateUtils = () => {
  const dispatch = useContext(DispatchContext);
  const { providerPropsData, sessionData } = useContext(StateContext);
  const SessionData = sessionData as CreatePaymentFuncType & sessionDataType;

  const isCustomerMode = SessionData?.mode === PaymentMode.Customer;

  useEffect(() => {
    () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const resetGlobalStates = (withTimeout = false) => {
    if (withTimeout) {
      timeoutId = setTimeout(
        () =>
          dispatch({
            type: Actions.RESET_STATES,
            payload: getInitialStateWithoutProviderPropsData(),
          }),
        3000
      );
    } else {
      dispatch({
        type: Actions.RESET_STATES,
        payload: getInitialStateWithoutProviderPropsData(),
      });
    }
  };

  // when payment is success global state is rest and invoking the success screen
  const onPaymentSuccess = () => {
    resetGlobalStates(isCustomerMode);
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.SUCCESS,
    });
  };

  // when payment is failed invoking the error screen
  const onPaymentFailed = () =>
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.FAILED,
    });

  // when payment is cancelled by the user
  const onPaymentCancelled = () => {
    resetGlobalStates(isCustomerMode);
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.CANCELLED,
    });
  };

  // when payment is completed but awaiting payment
  const onPaymentAwaiting = () => {
    resetGlobalStates();
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.COMPLETE,
    });
  };

  // when payment is failed invoking the error screen
  const onSessionExpired = () =>
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.EXPIRED,
    });

  const onUserCancel = async () => {
    if (SessionData?.onDismiss) {
      const sessionShowPayload = {
        publishableKey: providerPropsData?.publishableKey,
        sessionId: SessionData?.sessionId,
      };

      // fetch session status to check if the payment is completed
      const sessionResponse = await sessionShow(sessionShowPayload);
      // invoking client provided onDismiss callback
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      SessionData?.onDismiss(sessionResponse);
    }
  };

  // showing overlay loading indicator disabling all interactions
  const startLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: {
        app: true,
        payment: false,
      },
    });

  const startPaymentLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: {
        app: false,
        payment: true,
      },
    });

  // Hiding overlay loading indicator
  const stopLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: {
        app: false,
        payment: false,
      },
    });

  return {
    onPaymentSuccess,
    onPaymentFailed,
    onPaymentCancelled,
    onPaymentAwaiting,
    onSessionExpired,
    onUserCancel,
    startLoading,
    startPaymentLoading,
    stopLoading,
    resetGlobalStates,
  };
};

export default useMainStateUtils;
