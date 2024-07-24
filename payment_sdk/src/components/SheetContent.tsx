import React, { useContext, useEffect, useState } from "react";

import { FlatList, Keyboard, Platform, StyleSheet, View } from "react-native";

import { Actions, DispatchContext, StateContext } from "@context/state";

// import { isAndroid } from "@util/helpers";
import { PaymentType } from "@util/types";

import { responsiveScale } from "@theme/scalling";

import Loader from "./Loader";
import PillContainer from "./PillContainer";
import CardSection from "./sections/CardSection";
import KonbiniSection from "./sections/KonbiniSection";
import PayPaySection from "./sections/PayPaySection";
import SheetFooter from "./sections/SheetFooter";
import WebView from "./WebView";

// const KEYBOARD_OFFSET = isAndroid() ? 120 : 80;

const SheetContent = () => {
  const { paymentType, webViewData, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
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

  const renderItem = () => {
    return (
      <View style={styles.item}>
        <PillContainer onSelect={handlePillSelect} selectedItem={paymentType} />
        {paymentType === PaymentType.CREDIT && <CardSection />}
        {paymentType === PaymentType.PAY_PAY && <PayPaySection />}
        {paymentType === PaymentType.KONBINI && <KonbiniSection />}
        {renderLoading}
      </View>
    );
  };

  return (
    <View style={styles.mainContent}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[{ key: "content" }]}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingBottom: keyboardHeight },
        ]}
        ListFooterComponent={<SheetFooter />}
        ListFooterComponentStyle={styles.footerContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  item: {
    height: "100%",
  },
  footerContent: {
    ...Platform.select({
      ios: {
        marginBottom: responsiveScale(200),
        marginTop: -responsiveScale(60),
      },
      android: {
        marginBottom: responsiveScale(200),
        marginTop: -responsiveScale(60),
      },
    }),
  },
});

export default SheetContent;
