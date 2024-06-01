import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import PaymentSheet, {PaymentSheetRefProps} from './components/PaymentSheet';

type Props = {};

const AppTemp = (props: Props) => {
  const sheetRef = useRef<PaymentSheetRefProps>(null);

  const handleOpenSheet = () => {
    sheetRef.current?.open({
      sessionId: 'sessionId',
      amount: 1000,
      currency: 'JPY',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Press me" onPress={handleOpenSheet} />
      <PaymentSheet ref={sheetRef} />
    </SafeAreaView>
  );
};

export default AppTemp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
