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

> ### _In order to use the SDK you will have to install bellow packages as dependencies._

```sh
i18next
react-i18next
```

## Usage example

```tsx
// App.ts
import { KomojuSDK } from "@komoju/komoju-react-native";

function App() {
  return (
    <KomojuSDK.KomojuProvider publishable={PUBLISHABLE_KEY}>
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

### Setup a return URL.

Many payment method types require a return URL, so if you fail to provide it, we can’t present those payment methods to your user, even if you’ve enabled them.
When a customer exits your app, for example to authenticate in Safari or their banking app, provide a way for them to automatically return to your app afterward.

#### 1. Use `return_url` parameter when creating a session

#### 2. [Configure the custom URL scheme](https://reactnative.dev/docs/linking) in your AndroidManifest.xml and Info.plist files

> Note:
> If you’re using Expo, [set your scheme](https://docs.expo.dev/guides/linking/#in-a-standalone-app) in the app.json file.

To initialize Komoju in your React Native app, use the `KomojuSDK.KomojuProvider` component in the root component of your application.

`KomojuProvider` can accept `publishableKey`, `paymentMethods` and `language` as props. Only `publishableKey` is required.

```tsx
import {
  KomojuSDK,
  PaymentTypes,
  LanguageTypes,
} from "@komoju/komoju-react-native";

function App() {
  const [publishableKey, setpublishableKey] = useState("");

  const fetchpublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setpublishableKey(key);
  };

  useEffect(() => {
    fetchpublishableKey();
  }, []);

  return (
    <KomojuSDK.KomojuProvider
      publishableKey={publishableKey}
      paymentMethods={[PaymentTypes.KONBINI]} // explicitly set the payment method(s) for purchase
      language={LanguageTypes.JAPANESE} // explicitly set the language, if not set language will be picked from your session Id
    >
      // Your app code here
    </KomojuSDK.KomojuProvider>
  );
}
```

### Properties

| property           | type                     | description                                                                                                   |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **publishableKey** | `string`                 | Your publishable key from the KOMOJU [merchant settings page](https://komoju.com/sign_in/) (this is mandtory) |
| **paymentMethods** | `Array <PaymentTypes>`   | explicitly set the payment method(s) for purchase. (optional)                                                 |
| **language**       | `string (LanguageTypes)` | explicitly set the language, if not set language will be picked from your session Id (optional)               |
