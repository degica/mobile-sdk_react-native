import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const ScanCardButton = () => {
  return (
    <TouchableOpacity
      style={styles.scanIconRow}
      onPress={() => console.log('save card number in context')}>
      <Image style={styles.cardScan} source={require('../assets/images/scan.png')} />
      <Text style={styles.label}>Scan Card</Text>
    </TouchableOpacity>
  );
};

export default ScanCardButton;

const styles = StyleSheet.create({
  cardScan: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  scanIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#172E44',
  },
});
