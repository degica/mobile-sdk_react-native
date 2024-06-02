import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import SubmitButton from '../SubmitButton';
import LightBox from '../LightBox';

const PayPaySection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.title}>Payment via Paypay</Text>
        <Text style={styles.description}>
          You will be redirected to Paypay to complete the payment
        </Text>
      </View>
      <View style={styles.lbWrapper}>
        <LightBox
          content="Lorem ipsum dolor sit amet consectetur. Etiam accumsan nunc "
          icon="📱"
        />
      </View>
      <SubmitButton onPress={() => {}} label="Continue to Paypay" />
    </View>
  );
};

export default PayPaySection;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  textContent: {
    marginBottom: 24,
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172E44',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#172E44',
  },
  lbWrapper: {
    minHeight: 80,
    marginHorizontal: 16,
    marginBottom: 24,
  },
});
