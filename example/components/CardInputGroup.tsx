import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import Input from './Input';

type Props = {};

const CardInputGroup = (props: Props) => {
  return (
    <View style={styles.parentContainer}>
      <Text style={styles.label}>Card Number</Text>
      <View style={styles.container}>
        <View style={styles.cardNumberRow}>
          <Input
            value=""
            placeholder="1234 1234 1234 1234"
            onChangeText={() => {}}
          />
        </View>
        <View style={styles.splitRow}>
          <View style={styles.firstSplitItem}>
            <Input value="" placeholder="MM / YY" onChangeText={() => {}} />
          </View>
          <View style={styles.nextSplitItem}>
            <Input value="" placeholder="CVV" onChangeText={() => {}} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardInputGroup;

const styles = StyleSheet.create({
  parentContainer: {
    margin: 16,
    marginBottom: 24,
    flexGrow:0,
    minHeight: 130,
  },
  label: {
    marginBottom: 8,
    color: '#172E44',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAD6E1',
    maxHeight: 120,
  },
  cardNumberRow: {
    flex: 1,
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#CAD6E1',
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
  },
  firstSplitItem: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#CAD6E1',
  },
  nextSplitItem: {
    flex: 1,
  },
});
