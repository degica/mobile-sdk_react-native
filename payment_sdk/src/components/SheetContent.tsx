import React, { useContext, useEffect, useState } from "react";

import { Keyboard, ScrollView, StyleSheet, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "@context/state";

import { SCREEN_HEIGHT, isAndroid } from "@util/helpers";
import { PaymentType } from "@util/types";

import Loader from "./Loader";
import PillContainer from "./PillContainer";
import CardSection from "./sections/CardSection";
import KonbiniSection from "./sections/KonbiniSection";
import PayPaySection from "./sections/PayPaySection";
import SheetFooter from "./sections/SheetFooter";
import WebView from "./WebView";

const KEYBOARD_OFFSET = isAndroid() ? 120 : 80;

const SheetContent = () => {
  const { paymentType, webViewData, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height + KEYBOARD_OFFSET)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePillSelect = (type: PaymentType) => {
    dispatch({ type: Actions.SET_PAYMENT_OPTION, payload: type });
  };

  const renderLoading = loading ? <Loader /> : null;

  if (webViewData?.link)
    return (
      <WebView
        link={webViewData?.link}
        onNavigationStateChange={webViewData?.onNavChange}
      />
    );

  return (
    <View style={styles.mainContent}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: keyboardHeight }}
      >
        <PillContainer onSelect={handlePillSelect} selectedItem={paymentType} />
        {paymentType === PaymentType.CREDIT && <CardSection />}
        {paymentType === PaymentType.PAY_PAY && <PayPaySection />}
        {paymentType === PaymentType.KONBINI && <KonbiniSection />}
        {renderLoading}
      </ScrollView>
      <View style={styles.bottomContent}>
        <SheetFooter />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    height: "100%",
  },
  bottomContent: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: SCREEN_HEIGHT - (SCREEN_HEIGHT - 85 - 40),
  },
});

export default SheetContent;
