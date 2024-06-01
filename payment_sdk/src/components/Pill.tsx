import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

interface PillProps {
  label: string;
  icon: string;
  color: string;
}

const Pill: React.FC<PillProps> = ({label, icon, color}) => {
  return (
    <View style={styles.pill}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
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
    borderColor: 'black',
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
    fontWeight: 'bold',
  },
});

export default Pill;
