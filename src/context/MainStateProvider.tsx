import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import PaymentModal from "../components/PaymentModal";
import Sheet, { SheetRefProps } from "../components/Sheet";

import {
  CreatePaymentFuncType,
  InitPrams,
  KomojuProviderIprops,
} from "../util/types";

import "../assets/languages/i18n";
import { Actions, DispatchContext, KomojuContext } from "./state";
import useBackgroundHandler from "../hooks/useBackgroundHandler";
import useDeepLinkHandler from "../hooks/useDeepLinkHandler";
import useMainStateUtils from "../hooks/useMainStateUtils";
import usePaymentSheetToggle from "../hooks/usePaymentSheetToggle";
import useValidationHandler from "../hooks/useValidationHandler";

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeepLinkOpened, setIsDeepLinkOpened] = useState(false);

  const sheetRef = useRef<SheetRefProps>(null);

  // setting all props data on providerPropsData state
  useEffect(() => {
    dispatch({
      type: Actions.SET_PROVIDER_PROPS_DATA,
      payload: {
        publishableKey: props.publishableKey,
        paymentMethods: props?.paymentMethods,
        language: props?.language,
        useBottomSheet: props?.useBottomSheet,
        urlScheme: props?.urlScheme,
      },
    });
  }, [props]);

  // Show & Hide payment screen
  const { openPaymentSheet, closePaymentSheet } = usePaymentSheetToggle({
    toggleUIVisibility: (value: boolean) => setModalVisible(value),
    sheetRef: sheetRef,
  });

  // Get all the util functions that needs to function the Main State
  const { startLoading, stopLoading, onUserCancel, resetGlobalStates } =
    useMainStateUtils();

  // Handle deep-links of the module
  useDeepLinkHandler(setIsDeepLinkOpened, closePaymentSheet);

  // Handle events when module goes foreground
  useBackgroundHandler(
    isDeepLinkOpened,
    setIsDeepLinkOpened,
    closePaymentSheet
  );

  // Handle validations of the session
  const { validateSession } = useValidationHandler({
    props: props,
    startLoading: startLoading,
    stopLoading: stopLoading,
    closePaymentSheet: closePaymentSheet,
  });

  const createPayment = useCallback(
    ({ sessionId, onComplete, onDismiss }: CreatePaymentFuncType) => {
      resetGlobalStates();

      validateSession(sessionId);

      dispatch({
        type: Actions.SET_SESSION_DATA,
        payload: {
          sessionId: sessionId,
          onComplete: onComplete,
          onDismiss: onDismiss,
        },
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
        closePaymentSheet,
      }}
    >
      {renderChildren}
      {renderPaymentUI}
    </KomojuContext.Provider>
  );
};
