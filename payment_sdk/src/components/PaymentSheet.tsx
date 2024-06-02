import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import Sheet, { SheetRefProps } from "./Sheet";
import PillContainer from "./PillContainer";
import CardSection from "./sections/CardSection";
import PayPaySection from "./sections/PayPaySection";

export type PaymentSheetRefProps = {
  open: () => void;
};

const PaymentSheet = forwardRef<PaymentSheetRefProps, {}>((props, ref) => {
  const sheetRef = useRef<SheetRefProps>(null);
  const [selectedPill, setSelectedPill] = React.useState(0);

  const handlePillSelect = (index: number) => {
    setSelectedPill(index);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        sheetRef.current?.open();
      },
    }),
    [sheetRef]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Sheet ref={sheetRef}>
        <PillContainer
          onSelect={handlePillSelect}
          selectedItem={selectedPill}
        />
        {selectedPill === 0 && <CardSection />}
        {selectedPill === 2 && <PayPaySection />}
      </Sheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default PaymentSheet;
