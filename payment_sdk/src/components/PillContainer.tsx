import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Pill from './Pill';
import {FlatList} from 'react-native-gesture-handler';

type Props = {
  onSelect: (index: number) => void;
  selectedItem: number;
};

const options = [
  {
    label: 'Credit Card',
    icon: require('../assets/images/cc.png'),
    color: '#e0e0e0',
  },
  {
    label: 'Konbini',
    icon: require('../assets/images/shop.png'),
    color: '#a5d6a7',
  },
  {
    label: 'Paypay',
    icon: require('../assets/images/paypay.png'),
    color: '#ef9a9a',
  },
];

const PillContainer = ({onSelect, selectedItem}: Props) => {
  const renderItem = ({item, index}) => {
    return (
      <Pill
        isSelected={index === selectedItem}
        label={item.label}
        icon={item.icon}
        onPress={() => onSelect(index)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  contentContainer: {
    paddingLeft: 8,
  },
});

export default PillContainer;
