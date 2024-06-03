import React from 'react';
import {View, TextInput, Text, StyleSheet, ViewStyle} from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  hasBorder?: boolean;
  inputStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  inputStyle,
  hasBorder,
  placeholder,
}) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle, hasBorder && styles.withBorder]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    color: '#172E44',
  },
  input: {
    height: '100%',
    paddingLeft: 16,
    fontSize: 16,
  },
  withBorder: {
    borderColor: '#CAD6E1',
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default Input;
