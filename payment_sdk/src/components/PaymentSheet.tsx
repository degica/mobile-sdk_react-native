import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Sheet, {SheetRefProps} from './Sheet';
import PillContainer from './PillContainer';

export type PaymentSheetRefProps = {
  open: (params: {sessionId: string; amount: number; currency: string}) => void;
};

const PaymentSheet = forwardRef<PaymentSheetRefProps, {}>((props, ref) => {
  const sheetRef = useRef<SheetRefProps>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: ({sessionId, amount, currency}) => {
        sheetRef.current?.open({sessionId, amount, currency});
      },
    }),
    [sheetRef],
  );

  return (
    <GestureHandlerRootView
      style={{
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <Sheet ref={sheetRef}>
        <PillContainer />
      </Sheet>
    </GestureHandlerRootView>
  );
});

export default PaymentSheet;
