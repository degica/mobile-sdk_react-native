import React, { useContext } from "react";
import { ScrollView } from "react-native";

import PillContainer from "./PillContainer";
import WebView from "./WebView";
import CardSection from "./sections/CardSection";
import PayPaySection from "./sections/PayPaySection";
import { Actions, DispatchContext, StateContext } from "../state";
import Loader from "./Loader";
import SheetFooter from "./sections/SheetFooter";
import { PaymentType } from "../util/types";

const SheetContent = () => {
  const { paymentType, webViewLink, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handlePillSelect = (type: PaymentType) => {
    dispatch({ type: Actions.SET_PAYMENT_OPTION, payload: type });
  };

  const renderLoading = loading ? <Loader /> : null;

  if (webViewLink) return <WebView link={webViewLink} />;

  return (
    <ScrollView>
      <PillContainer onSelect={handlePillSelect} selectedItem={paymentType} />
      {paymentType === PaymentType.CREDIT && <CardSection />}
      {paymentType === PaymentType.PAY_PAY && <PayPaySection />}
      {renderLoading}
      <SheetFooter />
    </ScrollView>
  );
};

export default SheetContent;
