import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import { noop } from "./util/constants";
import { InitPrams, KomojuContext as KomjouContextType } from "./util/types";

const defaultValue = {
  createPayment: noop,
  showPaymentSheetUI: noop,
  initializeKomoju: noop,
};
export const KomojuContext =
  React.createContext<KomjouContextType>(defaultValue);

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [komojuState, setKomojuState] = useState<InitPrams>({});

  const createPayment = useCallback(() => {
    // here call the session pay
    // take params from state or props
  }, []);

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);
  const initializeKomoju = useCallback((params: InitPrams) => {}, []);

  const renderPaymentUI = useMemo(() => {
    const UI = showPaymentSheet ? <View /> : null;
    return UI;
  }, []);

  return (
    <KomojuContext.Provider
      value={{ createPayment, showPaymentSheetUI, initializeKomoju }}
    >
      {props.children}
      {renderPaymentUI}
    </KomojuContext.Provider>
  );
};
