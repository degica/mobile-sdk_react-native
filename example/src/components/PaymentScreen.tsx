import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import {
  KomojuSDK,
  SessionShowResponseType,
} from "@komoju/komoju-react-native";
import createSession from "../services/sessionService";

export enum CurrencyTypes {
  JPY = "JPY",
  USD = "USD",
}

type LanguageContentType = {
  title: string;
  placeholder: string;
  button: string;
  invalidAmount: string
}

const PaymentScreen = ({
  language,
  setLoading,
}: {
  language: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(CurrencyTypes.JPY);
  const [languageContent, setLanguageContent] = useState({
    title: "", placeholder: "", button: "", invalidAmount: "",
  } as LanguageContentType);

  useEffect(() => {
    setLanguageContent({
      title: language === "en" ? "Enter Amount to Pay with Komoju" : "KOMOJUで支払う金額を入力してください",
      placeholder: language === "en" ? "Enter amount" : "金額を入力",
      button: language === "en" ? "Checkout" : "チェックアウト",
      invalidAmount: language === "en" ? "Please enter an amount to checkout" : "チェックアウトするには金額を入力してください"
    });
  }, [language])

  // use createPayment method to invoke the payment screen
  const { createPayment } = KomojuSDK.useKomoju();

  const handleSessionPay = async () => {
    setLoading(true);
    if (!amount) {
      Alert.alert("Error", languageContent.invalidAmount);
      return;
    }

    // fetch a session Id to initiate payment
    const sessionId = await createSession({ amount, currency, language });
    setLoading(false);

    // invoke createPayment method with sessionId as parameters to open the payment portal
    createPayment({
      sessionId: sessionId ?? "",
      onComplete: onPaymentComplete,
      onDismiss: onPaymentComplete,
    });
  };

  // when the payment is complete pass a callback to get the final results of response
  const onPaymentComplete = (response: SessionShowResponseType) => {
    console.log(`Transaction Status: ${response?.status}`);
    setAmount("");
  };

  const changeCurrencyType = (key: CurrencyTypes) => {
    setCurrency(key);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.currencyRow}>
        {(Object.keys(CurrencyTypes) as Array<keyof typeof CurrencyTypes>).map(
          (key) => (
            <Pressable
              key={key}
              onPress={() => changeCurrencyType(CurrencyTypes[key])}
              style={[
                styles.currencyTextContainer,
                key === currency && styles.currencySelectedTextContainer,
              ]}
            >
              <Text style={[key === currency && styles.currencySelectedText]}>
                {key}
              </Text>
            </Pressable>
          )
        )}
      </View>
      <Text style={[styles.title]}>{languageContent.title}</Text>
      <TextInput
        style={[styles.input]}
        placeholder={languageContent.placeholder}
        placeholderTextColor={"#333"}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.buttonContainer}>
        <Button title={languageContent.button} onPress={handleSessionPay} color={"#007AFF"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  currencyRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  currencyTextContainer: {
    padding: 10,
  },
  currencySelectedTextContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "coral",
  },
  currencySelectedText: {
    color: "coral",
  },
});

export default PaymentScreen;
