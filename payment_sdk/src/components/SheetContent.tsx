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
import PaidyFormSection from "./sections/PaidyFormSection";
import SheetFooter from "./sections/SheetFooter";
import SimpleRedirectSection from "./sections/SimpleRedirectSection";
import SingleInputFormSection from "./sections/SingleInputFormSection";
import TransferFormSection from "./sections/TransferFormSection";

const SheetContent = () => {
  const { paymentType, loading } = useContext(StateContext);
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

  const getBaseScreenByPaymentType = (paymentType: PaymentType) => {
    switch (paymentType) {
      case PaymentType.CREDIT:
        return <CardSection />;
      case PaymentType.ALI_PAY:
      case PaymentType.AU_PAY:
      case PaymentType.PAY_PAY:
      case PaymentType.LINE_PAY:
      case PaymentType.MER_PAY:
      case PaymentType.RAKUTEN:
        return <SimpleRedirectSection type={paymentType} />;
      case PaymentType.NET_CASH:
      case PaymentType.BIT_CASH:
      case PaymentType.WEB_MONEY:
        return <SingleInputFormSection type={paymentType} />;
      case PaymentType.BANK_TRANSFER:
      case PaymentType.PAY_EASY:
        return <TransferFormSection type={paymentType} />;
      case PaymentType.KONBINI:
        return <KonbiniSection />;
      case PaymentType.PAIDY:
        return <PaidyFormSection type={paymentType} />;
      default:
        break;
    }
  };
  const renderItem = () => {
    return (
      <View style={styles.item}>
        <PillContainer onSelect={handlePillSelect} selectedItem={paymentType} />
        {getBaseScreenByPaymentType(paymentType)}
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
        ListFooterComponent={
          <>
            <View style={styles.footerSpace} />
            <SheetFooter />
          </>
        }
        ListFooterComponentStyle={styles.footerContent}
        keyboardShouldPersistTaps="handled"
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
  footerSpace: {
    flex: 1,
  },
  footerContent: {
    ...Platform.select({
      ios: {
        marginBottom: responsiveScale(100),
        marginTop: -responsiveScale(60),
      },
      android: {
        marginBottom: responsiveScale(100),
        marginTop: -responsiveScale(60),
      },
    }),
  },
});

export default SheetContent;
