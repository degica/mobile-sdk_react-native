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

  const createPayment = useCallback(
    ({ sessionId, onError, onSuccess }: CreatePaymentFuncType) => {
      dispatch({
        type: Actions.SESSION_PAY,
        payload: async ({ paymentType, cardDetails }: sessionPayProps) => {
          const response = await payForSession({
            paymentType,
            sessionId,
            publicKey: props.publicKey,
            cardDetails,
          });

          if (response?.status === PaymentStatuses.PENDING) {
            dispatch({
              type: Actions.SET_WEBVIEW_LINK,
              payload: response.redirect_url,
            });
          } else if (response?.status === PaymentStatuses.SUCCESS) {
            sheetRef?.current?.close();
            onSuccess
              ? onSuccess()
              : Alert.alert(
                  "Success",
                  "The payment was confirmed successfully"
                );
          } else {
            onError
              ? onError()
              : Alert.alert("Error", "Unable to Process Payment");
          }
        },
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
