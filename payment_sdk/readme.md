# Komoju SDK for React Native

[![NPM Version](https://img.shields.io/npm/v/%40komoju%2Fkomoju-react-native)](https://www.npmjs.com/package/@komoju/komoju-react-native)
[![License](https://img.shields.io/npm/l/%40komoju%2Fkomoju-react-native)](https://www.npmjs.com/package/@komoju/komoju-react-native)

**Welcome to the Komoju Payment Gateway SDK!** This SDK empowers you to seamlessly integrate secure payment processing into your Android and iOS apps using React Native.

## Getting Started

Get started with our
[Developer-oriented API documentation](https://doc.komoju.com/) or [example project](https://github.com/degica/mobile-sdk_react-native/tree/main/example)

## Installation

```sh
yarn add @komoju/komoju-react-native
or
npm install @komoju/komoju-react-native
```

> ### _In order to use the SDK you will have to install bellow packages as dependancies._

```sh
i18next
react-i18next
react-native-webview
```

## Usage example

```tsx
// App.ts
import { KomojuSDK } from "@komoju/komoju-react-native";

function App() {
  return (
    <KomojuSDK.KomojuProvider publicKey={PUBLIC_KEY}>
      <PaymentScreen />
    </KomojuSDK.KomojuProvider>
  );
}

// PaymentScreen.ts
import { KomojuSDK } from "@komoju/komoju-react-native";

export default function PaymentScreen() {
  const { createPayment } = KomojuSDK.useKomoju();

  const checkout = async () => {
    createPayment({
      sessionId, // retrieve this from your server
      onComplete, // (optional) pass a callback to get the final results of response when payment is complete
    });
  };

  return (
    <View>
      <Button title="Checkout" onPress={checkout} />
    </View>
  );
}
```

## Komoju initialization

You can [visit our docs](https://doc.komoju.com/reference/createsession) to see how a session id can be created

To initialize Komoju in your React Native app, use the `KomojuSDK.KomojuProvider` component in the root component of your application.

`KomojuProvider` can accept `publicKey`, `payment_methods` and `language` as props. Only `publicKey` is required.

```tsx
import {
  KomojuSDK,
  PaymentTypes,
  LanguageTypes,
} from "@komoju/komoju-react-native";

function App() {
  const [publicKey, setPublicKey] = useState("");

  const fetchPublicKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublicKey(key);
  };

  useEffect(() => {
    fetchPublicKey();
  }, []);

  return (
    <KomojuSDK.KomojuProvider
      publicKey={publicKey}
      payment_methods={[PaymentTypes.KONBINI]} // explicitly set the payment method(s) for purchase
      language={LanguageTypes.JAPANESE} // explicitly set the language, if not set language will be picked from your session Id
    >
      // Your app code here
    </KomojuSDK.KomojuProvider>
  );
}
```

### Properties

| property            | type                     | description                                                                                                   |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **publicKey**       | `string`                 | Your publishable key from the KOMOJU [merchant settings page](https://komoju.com/sign_in/) (this is mandtory) |
| **payment_methods** | `Array <PaymentTypes>`   | explicitly set the payment method(s) for purchase. (optional)                                                 |
| **language**        | `string (LanguageTypes)` | explicitly set the language, if not set language will be picked from your session Id (optional)               |
