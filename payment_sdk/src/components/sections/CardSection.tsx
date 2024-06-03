import {StyleSheet, View} from 'react-native';
import React from 'react';
import Input from '../Input';
import CardInputGroup from '../CardInputGroup';
import SubmitButton from '../SubmitButton';

type Props = {};

const CardSection = (props: Props) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardNameContainer}>
        <Input
          value=""
          label="Cardholder name"
          placeholder="Full name on card"
          onChangeText={() => {}}
          hasBorder
          inputStyle={styles.inputStyle}
        />
      </View>
      <CardInputGroup />
      <SubmitButton label="Pay $100" onPress={() => {}} />
    </View>
  );
};

export default CardSection;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  cardNameContainer: {
    margin: 16,
    marginBottom: 24,
    height: 60,
  },
  inputStyle: {
    height: 50,
  },
});
