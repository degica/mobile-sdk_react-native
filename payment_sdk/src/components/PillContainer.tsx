import React from 'react';
import {ScrollView} from 'react-native';
import Pill from './Pill';

const PillContainer = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: 8}}>
      <Pill label="Credit Card" icon="💳" color="#e0e0e0" />
      <Pill label="Konbini" icon="🏪" color="#a5d6a7" />
      <Pill label="Konbini" icon="🏪" color="#a5d6a7" />
      <Pill label="Paypay" icon="💰" color="#ef9a9a" />
    </ScrollView>
  );
};

export default PillContainer;
