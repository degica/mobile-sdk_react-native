import {Dispatch, SetStateAction} from "react";
import {View, Pressable, StyleSheet, Text} from "react-native";
import {LanguageTypes} from "@komoju/komoju-react-native";

const LanguageSelectComponent = ({
  language,
  setLanguage,
}: {
  language: LanguageTypes;
  setLanguage: Dispatch<SetStateAction<LanguageTypes>>;
}) => {

  return (
    <View style={[styles.container]}>
      {(Object.keys(LanguageTypes) as Array<keyof typeof LanguageTypes>).map(
        key => (
          <Pressable
            key={key}
            onPress={() => setLanguage(LanguageTypes[key])}
            style={[
              styles.languageTextContainer,
              LanguageTypes[key] === language &&
                styles.languageSelectedTextContainer,
            ]}>
            <Text
              style={[
                LanguageTypes[key] === language && styles.languageSelectedText,
              ]}>
              {key}
            </Text>
          </Pressable>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    zIndex: -100,
    height: 40,
  },
  languageTextContainer: {
    padding: 10,
  },
  languageSelectedTextContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "coral",
  },
  languageSelectedText: {
    color: "coral",
  },
});

export default LanguageSelectComponent;
