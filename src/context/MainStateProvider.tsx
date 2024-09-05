import { useCallback, useContext, useMemo, useRef, useState } from "react";

import PaymentModal from "../components/PaymentModal";
import Sheet, { SheetRefProps } from "../components/Sheet";

import {
  CreatePaymentFuncType,
  initialState,
  InitPrams,
  KomojuProviderIprops,
} from "../util/types";

import "../assets/languages/i18n";
import { Actions, DispatchContext, KomojuContext } from "./state";
import useBackgroundHandler from "../hooks/useBackgroundHandler";
import useDeepLinkHandler from "../hooks/useDeepLinkHandler";
import usePaymentHandler from "../hooks/usePaymentHandler";
import useMainStateUtils from "../hooks/useMainStateUtils";

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);
  const [modalVisible, setModalVisible] = useState(false);

  const sheetRef = useRef<SheetRefProps>(null);
  // ref to hold client provided onComplete callback
  const onCompleteCallback = useRef(null);
  // ref to hold client provided onDismiss callback
  const onDismissCallback = useRef(null);
  // ref to hold client provided session Id
  const sessionIdRef = useRef("");

  // Get all the util functions that needs to function the Main State
  const {
    startLoading,
    stopLoading,
    onPaymentAwaiting,
    onPaymentCancelled,
    onSessionExpired,
    onPaymentFailed,
    onPaymentSuccess,
    closePaymentSheet,
    onUserCancel,
    openPaymentSheet,
    resetGlobalStates,
  } = useMainStateUtils({
    props: props,
    sheetRef: sheetRef,
    sessionIdRef: sessionIdRef,
    toggleUIVisibility: (value: boolean) => setModalVisible(value),
    initialState: initialState,
    onDismissCallback: onDismissCallback,
  });

  // Handle events when module goes foreground
  useBackgroundHandler({
    props: props,
    startLoading: startLoading,
    stopLoading: stopLoading,
    sessionIdRef: sessionIdRef,
    onCompleteCallback: onCompleteCallback,
    onPaymentAwaiting: onPaymentAwaiting,
    onPaymentCancelled: onPaymentCancelled,
    onSessionExpired: onSessionExpired,
    onPaymentFailed: onPaymentFailed,
    onPaymentSuccess: onPaymentSuccess,
  });

  // Handle deep-links of the module
  useDeepLinkHandler({
    props: props,
    startLoading: startLoading,
    stopLoading: stopLoading,
    sessionIdRef: sessionIdRef,
    onCompleteCallback: onCompleteCallback,
    onPaymentAwaiting: onPaymentAwaiting,
    onPaymentCancelled: onPaymentCancelled,
    onPaymentFailed: onPaymentFailed,
    onPaymentSuccess: onPaymentSuccess,
  });

  // Handle validations of the session and pay for session
  const { sessionPay, validateSession } = usePaymentHandler({
    props: props,
    startLoading: startLoading,
    stopLoading: stopLoading,
    onPaymentAwaiting: onPaymentAwaiting,
    onPaymentFailed: onPaymentFailed,
    onPaymentSuccess: onPaymentSuccess,
    closePaymentSheet: closePaymentSheet,
  });

  const createPayment = useCallback(
    ({ sessionId, onComplete, onDismiss }: CreatePaymentFuncType) => {
      resetGlobalStates();

      // setting client provided onComplete callback into a ref
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onCompleteCallback.current = onComplete;
      // setting client provided onDismiss callback into a ref
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onDismissCallback.current = onDismiss;
      // setting client provided session Id and into a ref
      sessionIdRef.current = sessionId;

      validateSession(sessionId);

      dispatch({
        type: Actions.SESSION_PAY,
        payload: sessionPay({
          sessionId,
        }),
      });
      openPaymentSheet();
    },
    [props]
  );

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);

  // TODO: Fix this type error

  const initializeKomoju = useCallback((_params: InitPrams) => {}, []);

  // Conditionally rendering the payment ui
  const renderPaymentUI = useMemo(() => {
    const UI = props?.useBottomSheet ? (
      <Sheet ref={sheetRef} onDismiss={onUserCancel} />
    ) : (
      <PaymentModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDismiss={onUserCancel}
      />
    );
    return UI;
  }, [sheetRef, modalVisible]);

  const renderChildren = useMemo(() => props?.children, [props.children]);

  return (
    <KomojuContext.Provider
      value={{
        createPayment,
        showPaymentSheetUI,
        initializeKomoju,
      }}
    >
      {renderChildren}
      {renderPaymentUI}
    </KomojuContext.Provider>
  );
};
