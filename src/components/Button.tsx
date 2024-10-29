import { StyleSheet, Text, TouchableOpacity, Keyboard } from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "../util/types";

import { resizeFonts, responsiveScale } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";
import { ReactNode } from "react";

type Props = {
  /**
   * Action to take on button press
   */
  onPress: () => void;
  /**
   * The button label
   */
  label: string;
  /**
   * Suffix for the end of the label e.g. "JPY" label would be "Pay 1000 JPY"
   */
  labelSuffix?: string;
  /**
   * Annotation for testing purposes
   */
  testID?: string;
  /**
   * Style override
   */
  style?: object;
  /**
   * Whether the button is disabled or not
   */
  disabled?: boolean;
  /**
   * Node to embed within the button
   */
  children?: ReactNode;
};

/**
 * Default UI Button
 *
 * @example
 * <Button
 *   label="Pay 1000"
 *   labelSuffix="JPY"
 *   onPress={someAction}
*  />
 */
const Button = ({
  label,
  labelSuffix,
  onPress,
  testID,
  style,
  disabled = false,
  children,
}: Props) => {
  const { t } = useTranslation();
  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  const onSubmit = () => {
    Keyboard.dismiss();
    onPress();
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.buttonWrapper, style]}
      onPress={onSubmit}
      disabled={disabled}
    >
      <Text style={styles.label}>
        {labelSuffix ? `${t(label)} ${labelSuffix}` : t(label)}
      </Text>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    buttonWrapper: {
      backgroundColor: theme.PRIMARY_COLOR,
      borderRadius: responsiveScale(8),
      height: responsiveScale(50),
      marginHorizontal: responsiveScale(16),
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      color: "white",
      fontSize: resizeFonts(16),
      fontWeight: "bold",
    },
  });
};
