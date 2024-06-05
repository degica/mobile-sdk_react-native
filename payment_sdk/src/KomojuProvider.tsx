import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Alert } from "react-native";

import {
  CreatePaymentFuncType,
  InitPrams,
  PaymentStatuses,
  sessionPayProps,
} from "./util/types";
import PaymentSheet, { PaymentSheetRefProps } from "./components/PaymentSheet";

import { Actions, DispatchContext, KomojuContext, StateContext } from "./state";
import StateProvider from "./components/paymentState/stateProvider";
import payForSession from "./services/paymentService";
import sessionShow from "./services/sessionShow";
import { validateSessionResponse } from "./util/validator";

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  return (
    <StateProvider>
      <MainStateProvider
        urlScheme={props.urlScheme}
        publicKey={props.publicKey}
      >
        {props.children}
      </MainStateProvider>
    </StateProvider>
  );
};

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);

  const sheetRef = useRef<PaymentSheetRefProps>(null);

  const validateSession = async (sessionId: string) => {
    dispatch({ type: Actions.SET_LOADING, payload: true });

    const sessionData = await sessionShow({
      sessionId,
      publicKey: props.publicKey,
    });

    if (validateSessionResponse(sessionData)) {
      sheetRef?.current?.close();
      Alert.alert("Error", "Session expired");
    }

    dispatch({ type: Actions.SET_AMOUNT, payload: sessionData?.amount });
    dispatch({ type: Actions.SET_CURRENCY, payload: sessionData?.currency });
    dispatch({ type: Actions.SET_LOADING, payload: false });
  };

  const sessionPay = ({
    sessionId,
    onSuccess,
    onError,
  }: CreatePaymentFuncType) => {
    return async ({ paymentType, cardDetails }: sessionPayProps) => {
      dispatch({ type: Actions.SET_LOADING, payload: true });

      const response = await payForSession({
        paymentType,
        sessionId,
        publicKey: props.publicKey,
        cardDetails,
      });

      dispatch({ type: Actions.SET_LOADING, payload: false });

      if (response?.status === PaymentStatuses.PENDING) {
        dispatch({
          type: Actions.SET_WEBVIEW_LINK,
          payload: response.redirect_url,
        });
      } else if (response?.status === PaymentStatuses.SUCCESS) {
        sheetRef?.current?.close();
        onSuccess
          ? onSuccess()
          : Alert.alert("Success", "The payment was confirmed successfully");
      } else {
        onError ? onError() : Alert.alert("Error", "Unable to Process Payment");
      }
    };
  };

  const createPayment = useCallback(
    ({ sessionId, onError, onSuccess }: CreatePaymentFuncType) => {
      validateSession(sessionId);

      dispatch({
        type: Actions.SESSION_PAY,
        payload: sessionPay({ sessionId, onError, onSuccess }),
      });
      sheetRef?.current?.open();
    },
    [props]
  );

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);

  const initializeKomoju = useCallback((params: InitPrams) => {}, []);

  const renderPaymentUI = useMemo(() => {
    const UI = <PaymentSheet ref={sheetRef} />;
    return UI;
  }, [sheetRef]);

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
