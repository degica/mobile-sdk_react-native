import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Sheet, {SheetRefProps} from './Sheet';
import PillContainer from './PillContainer';
import CardInputGroup from './CardInputGroup';
import Input from './Input';
import CardSection from './sections/CardSection';
import SubmitButton from './SubmitButton';
import PayPaySection from './sections/PayPaySection';

export type PaymentSheetRefProps = {
  open: (params: {sessionId: string; amount: number; currency: string}) => void;
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
      open: ({sessionId, amount, currency}) => {
        sheetRef.current?.open({sessionId, amount, currency});
      },
    }),
    [sheetRef],
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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

export default PaymentSheet;
