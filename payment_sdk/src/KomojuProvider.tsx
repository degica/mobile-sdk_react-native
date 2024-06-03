import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { InitPrams, KomojuContext as KomjouContextType } from "./util/types";
import PaymentSheet, { PaymentSheetRefProps } from "./components/PaymentSheet";

import { KomojuContext, StateContext } from "./state";
import StateProvider from "./components/paymentState/stateProvider";

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  return (
    <StateProvider>
      <MainStateProvider
        urlScheme={props.urlScheme}
        pubickKey={props.pubickKey}
      >
        {props.children}
      </MainStateProvider>
    </StateProvider>
  );
};

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [komojuState, setKomojuState] = useState<InitPrams>({
    urlScheme: "",
    pubickKey: "",
  });

  const sheetRef = useRef<PaymentSheetRefProps>(null);

  const createPayment = useCallback(() => {
    // here call the session pay
    // take params from state or props
    sheetRef?.current?.open();
  }, [props]);

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
