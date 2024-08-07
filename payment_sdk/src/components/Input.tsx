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

import { ThemeSchemeType } from "@util/types";

import { resizeFonts, responsiveScale } from "@theme/scalling";
import { useCurrentTheme } from "@theme/useCurrentTheme";

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
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  return (
    <View>
      {label && <Text style={styles.label}>{t(label)}</Text>}
      <TextInput
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={t(placeholder || "")}
        placeholderTextColor={theme.INPUT_PLACEHOLDER}
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

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    label: {
      fontSize: resizeFonts(16),
      marginBottom: responsiveScale(8),
      color: theme.TEXT_COLOR,
    },
    input: {
      height: "100%",
      paddingLeft: responsiveScale(16),
      fontSize: resizeFonts(16),
      borderColor: theme.CARD_BORDER,
      borderWidth: responsiveScale(1),
      borderRadius: responsiveScale(8),
      backgroundColor: theme.INPUT_BACKGROUND,
      color: theme.INPUT_TEXT,
    },
    withErrorBorder: {
      borderColor: theme.ERROR,
    },
    withBorder: {},
  });
}

export default Input;
