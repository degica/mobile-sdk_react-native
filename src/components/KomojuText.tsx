import { Text, StyleProp, TextStyle } from "react-native";

import { useTranslation } from "react-i18next";

interface KomojuTextProps {
  children?: string;
  style?: StyleProp<TextStyle>;
}

const KomojuText = ({ children, style = {} }: KomojuTextProps) => {
  const { t } = useTranslation();

  return <Text style={style}>{t(children as string)}</Text>;
};

export default KomojuText;
