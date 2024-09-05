import { MutableRefObject, RefObject, useContext } from "react";

import { Actions, DispatchContext } from "../context/state";
import { SheetRefProps } from "../components/Sheet";
import {
  KomojuProviderIprops,
  ResponseScreenStatuses,
  State,
} from "../util/types";
import sessionShow from "../services/sessionShow";

type Props = {
  props: KomojuProviderIprops;
  sheetRef: RefObject<SheetRefProps>;
  sessionIdRef: MutableRefObject<string>;
  toggleUIVisibility: (value: boolean) => void;
  initialState: State;
  onDismissCallback: MutableRefObject<null>;
};

const useMainStateUtils = ({
  props,
  sheetRef,
  sessionIdRef,
  toggleUIVisibility,
  initialState,
  onDismissCallback,
}: Props) => {
  const dispatch = useContext(DispatchContext);
  const openPaymentSheet = () => {
    if (props?.useBottomSheet) {
      sheetRef?.current?.open();
    } else {
      toggleUIVisibility(true);
    }
  };

  const closePaymentSheet = () => {
    // TODO: Fix this type error
    // @ts-expect-error - Object is possibly 'null'.
    sheetRef?.current?.close(false);
    toggleUIVisibility(false);
  };

  const resetGlobalStates = () =>
    dispatch({
      type: Actions.RESET_STATES,
      payload: initialState,
    });

  // when payment is success global state is rest and invoking the success screen
  const onPaymentSuccess = () => {
    resetGlobalStates();
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
    resetGlobalStates();
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
    if (onDismissCallback.current) {
      const sessionShowPayload = {
        publishableKey: props?.publishableKey,
        sessionId: sessionIdRef.current,
      };

      // fetch session status to check if the payment is completed
      const sessionResponse = await sessionShow(sessionShowPayload);
      // invoking client provided onDismiss callback
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onDismissCallback.current(sessionResponse);
    }
  };

  // showing overlay loading indicator disabling all interactions
  const startLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: true,
    });

  // Hiding overlay loading indicator
  const stopLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: false,
    });

  return {
    openPaymentSheet,
    closePaymentSheet,
    onPaymentSuccess,
    onPaymentFailed,
    onPaymentCancelled,
    onPaymentAwaiting,
    onSessionExpired,
    onUserCancel,
    startLoading,
    stopLoading,
    resetGlobalStates,
  };
};

export default useMainStateUtils;
