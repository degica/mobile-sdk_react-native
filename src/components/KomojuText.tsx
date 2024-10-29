import { Text, StyleProp, TextStyle } from "react-native";

import { useTranslation } from "react-i18next";

interface KomojuTextProps {
  /**
   * Heading text
   */
  children?: string;
  /**
   * Styling override
   */
  style?: StyleProp<TextStyle>;
}

/**
 * Heading text used for titles
 *
 * @example
 * ```jsx
 * <KomojuText
 *   content="My Page Title"
 *   style={styles.override}
 * </KomojuText>
 * ```
 */
const KomojuText = ({ children, style = {} }: KomojuTextProps) => {
  const { t } = useTranslation();

  return <Text style={style}>{t(children as string)}</Text>;
};

export default KomojuText;
