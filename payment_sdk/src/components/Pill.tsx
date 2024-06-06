import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

interface PillProps {
  label: string;
  icon: any;
  onPress: () => void;
  isSelected?: boolean;
}

const Pill: React.FC<PillProps> = ({label, icon, onPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.activeDeco]}
      onPress={onPress}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    height: 82,
    backgroundColor: 'white',
    borderColor: '#CAD6E1',
    borderWidth: 1,
    width: (Dimensions.get('window').width - 32) / 3,
    marginRight: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: '#172E44',
    fontWeight: '500',
  },
  activeDeco: {
    borderColor: '#172E44',
  },
});

export default Pill;
