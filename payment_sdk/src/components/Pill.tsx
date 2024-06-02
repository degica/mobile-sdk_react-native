import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

interface PillProps {
  label: string;
  icon: string;
  onPress: () => void;
  isSelected?: boolean;
}

const Pill: React.FC<PillProps> = ({label, icon, onPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.activeDeco]}
      onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
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
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: '#172E44',
    fontWeight: 'bold',
  },
  activeDeco: {
    borderColor: '#172E44',
  },
});

export default Pill;
