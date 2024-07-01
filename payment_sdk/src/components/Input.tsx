import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import { useTranslation } from "react-i18next";

interface InputProps extends TextInputProps {
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
  const { t } = useTranslation();

  return (
    <View>
      {label && <Text style={styles.label}>{t(label)}</Text>}
      <TextInput
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={t(placeholder || "")}
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
