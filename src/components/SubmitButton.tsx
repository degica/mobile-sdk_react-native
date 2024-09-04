import { StyleSheet, Text, TouchableOpacity, Keyboard } from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "../util/types";

import { resizeFonts, responsiveScale } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";

type Props = {
  onPress: () => void;
  label: string;
  labelSuffix?: string;
  testID?: string;
};

const SubmitButton = ({ label, labelSuffix, onPress, testID }: Props) => {
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
      style={styles.buttonWrapper}
      onPress={onSubmit}
    >
      <Text style={styles.label}>
        {labelSuffix ? `${t(label)} ${labelSuffix}` : t(label)}
      </Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

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