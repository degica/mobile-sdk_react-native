import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import Sheet, { SheetRefProps } from "./Sheet";
import SheetContent from "./SheetContent";

export type PaymentSheetRefProps = {
  open: () => void;
};

const PaymentSheet = forwardRef<PaymentSheetRefProps, {}>((props, ref) => {
  const sheetRef = useRef<SheetRefProps>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        sheetRef.current?.open();
      },
      close: () => {
        sheetRef.current?.close();
      },
    }),
    [sheetRef]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Sheet ref={sheetRef}>
        <SheetContent />
      </Sheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default PaymentSheet;
