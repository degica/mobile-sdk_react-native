import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { InitPrams, KomojuContext as KomjouContextType } from "./util/types";
import PaymentSheet, { PaymentSheetRefProps } from "./components/PaymentSheet";

import { KomojuContext } from "./state";

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [komojuState, setKomojuState] = useState<InitPrams>({
    urlScheme: "",
    pubickKey: "",
  });

  const sheetRef = useRef<PaymentSheetRefProps>(null);

  const createPayment = useCallback(() => {
    // here call the session pay
    // take params from state or props
    console.log("calling create payment", props.urlScheme, props.pubickKey);
    sheetRef?.current?.open();
  }, [props]);

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);

  const initializeKomoju = useCallback((params: InitPrams) => {}, []);

  const renderPaymentUI = useMemo(() => {
    const UI = <PaymentSheet ref={sheetRef} />;
    return UI;
  }, []);

  return (
    <KomojuContext.Provider
      value={{
        createPayment,
        showPaymentSheetUI,
        initializeKomoju,
      }}
    >
      {props.children}
      {renderPaymentUI}
    </KomojuContext.Provider>
  );
};
