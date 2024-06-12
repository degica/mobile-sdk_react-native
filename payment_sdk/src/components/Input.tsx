import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  inputStyle?: ViewStyle;
  testID?: string;
  error?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  inputStyle,
  placeholder,
  testID,
  error = false,
  keyboardType,
  ...rest
}: InputProps) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          styles.withBorder,
          error && styles.withErrorBorder,
          inputStyle,
        ]}
        testID={testID}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#172E44",
  },
  input: {
    height: "100%",
    paddingLeft: 16,
    fontSize: 16,
    borderColor: "#CAD6E1",
    borderWidth: 1,
    borderRadius: 8,
  },
  withErrorBorder: {
    borderColor: "#F24D49",
  },
  withBorder: {},
});

export default Input;
