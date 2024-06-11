import React, { useContext, useEffect, useState } from "react";
import { Keyboard, ScrollView } from "react-native";

import PillContainer from "./PillContainer";
import WebView from "./WebView";
import CardSection from "./sections/CardSection";
import PayPaySection from "./sections/PayPaySection";
import { Actions, DispatchContext, StateContext } from "../state";
import Loader from "./Loader";
import SheetFooter from "./sections/SheetFooter";
import { PaymentType } from "../util/types";
import KonbiniSection from "./sections/KonbiniSection";

const SheetContent = () => {
  const { paymentType, webViewData, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
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
    <>
      <ScrollView contentContainerStyle={{paddingBottom: keyboardHeight}}>
        <PillContainer onSelect={handlePillSelect} selectedItem={paymentType} />
        {paymentType === PaymentType.CREDIT && <CardSection />}
        {paymentType === PaymentType.PAY_PAY && <PayPaySection />}
        {paymentType === PaymentType.KONBINI && <KonbiniSection />}
        {renderLoading}
      </ScrollView>
      <SheetFooter />
    </>
  );
};

export default SheetContent;
