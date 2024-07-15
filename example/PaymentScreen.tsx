import React, {useState} from 'react';
import {
  useColorScheme,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native';
import {KomojuSDK} from '@komoju/komoju-react-native';
import createSession from './services/sessionService';

export enum CurrencyTypes {
  JPY = 'JPY',
  USD = 'USD',
}

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(CurrencyTypes.JPY);
  const colorScheme = useColorScheme(); // Detects the color scheme of the device

  // use createPayment method to invoke the payment screen
  const {createPayment} = KomojuSDK.useKomoju();

  const handleSessionPay = async () => {
    // fetch a session Id to initiate payment
    const sessionId = await createSession({amount, currency});

    // invoke createPayment method with sessionId as parameters to open the payment portal
    sessionId &&
      createPayment({
        sessionId,
        onComplete: onPaymentComplete,
        onDismiss: onPaymentComplete,
      });
  };

  // when the payment is complete pass a callback to get the final results of response
  const onPaymentComplete = (response: any) => {
    console.log(`Transaction Status: ${response?.status}`);
    setAmount('');
  };

  const changeCurrencyType = (key: CurrencyTypes) => {
    setCurrency(key);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#FFF',
    },
    text: {
      color: colorScheme === 'dark' ? '#FFF' : '#000',
    },
    input: {
      backgroundColor: colorScheme === 'dark' ? '#555' : '#FFF',
      color: colorScheme === 'dark' ? '#FFF' : '#000',
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.currencyRow}>
        {(Object.keys(CurrencyTypes) as Array<keyof typeof CurrencyTypes>).map(
          key => (
            <Pressable key={key} onPress={() => changeCurrencyType(key)}>
              <Text
                style={[
                  styles.currencyText,
                  key === currency && styles.currencySelectedText,
                  dynamicStyles.text,
                ]}>
                {key}
              </Text>
            </Pressable>
          ),
        )}
      </View>
      <Text style={[styles.title, dynamicStyles.text]}>
        Enter Amount to Pay with Komoju
      </Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Enter amount"
        placeholderTextColor={colorScheme === 'dark' ? '#CCC' : '#333'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Checkout"
          onPress={handleSessionPay}
          disabled={!amount}
          color={colorScheme === 'dark' ? '#888' : '#007AFF'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: -100,
    height: 40,
  },
  currencyRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  currencyText: {
    paddingRight: 20,
  },
  currencySelectedText: {
    color: 'coral',
  },
});

export default PaymentScreen;
