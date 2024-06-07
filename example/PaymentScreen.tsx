import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');

  const handleSecureTokenPayment = () => {
    Alert.alert('Payment', `Processing Secure Token Payment for $${amount}`);
    // Add your payment processing logic here
  };

  const handleSessionPay = () => {
    Alert.alert('Payment', `Processing Session Pay for $${amount}`);
    // Add your payment processing logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Amount to Pay with Komoju</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount in dollars"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Secure Token Payment"
          onPress={handleSecureTokenPayment}
        />
        <Button title="Session Pay" onPress={handleSessionPay} />
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
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 100,
  },
});

export default PaymentScreen;
