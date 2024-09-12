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

For a complete example, [visit our docs](https://doc.komoju.com/docs/react-native).

```tsx
// App.ts
import { KomojuSDK } from "@komoju/komoju-react-native";

function App() {
  return (
    <KomojuSDK.KomojuProvider
      publishableKey={PUBLISHABLE_KEY}
      urlScheme="your-url-scheme"
    >
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

Several payment methods require a `return_url`. If this is not provided, we won't be able to display these payment options to your users, even if they are enabled. When a customer exits your app, ensure there is a way for them to automatically return to your app afterward.

#### 1. Use `return_url` parameter when creating a session

#### 2. [Configure the custom URL scheme](https://reactnative.dev/docs/linking) in your AndroidManifest.xml and Info.plist files

> Note:
> If you’re using Expo, [set your scheme](https://docs.expo.dev/guides/linking/#in-a-standalone-app) in the app.json file.

To initialize Komoju in your React Native app, use the `KomojuSDK.KomojuProvider` component in the root component of your application.

`KomojuProvider` can accept `publishableKey`, `paymentMethods`, `language` and `theme` as props. Only `publishableKey` is required.

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

    const theme = {
    primaryColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    errorColor: '#FF3B30',
    textColor: '#000000',
    // ... other theme properties
  };

  return (
    <KomojuSDK.KomojuProvider
      publishableKey={publishableKey}
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      paymentMethods={[PaymentTypes.KONBINI]} // explicitly set the payment method(s) for purchase
      language={LanguageTypes.JAPANESE} // explicitly set the language, if not set language will be picked from your session Id
      theme={theme} // set custom theme
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
| **urlScheme**      | `string`                 | Your return url for customers to return to the app after completing browser authentications                   |
| **paymentMethods** | `Array <PaymentTypes>`   | explicitly set the payment method(s) for purchase. (optional)                                                 |
| **language**       | `string (LanguageTypes)` | explicitly set the language, if not set language will be picked from your session Id (optional)               |
| **theme**       | `UserFriendlyTheme` | Custom theme object to style the SDK (optional)               |


### Theme Structure
The theme prop accepts an object with the following structure:

```tsx
interface UserFriendlyTheme {
  primaryColor: string;
  backgroundColor: string;
  errorColor: string;
  textColor: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  invertedContent: string;
  transparentWhite: string;
  cardBackground: string;
  cardBorder: string;
  lightBox: string;
  cardShadowIOS: string;
  cardShadowAndroid: string;
}
```

You can customize any or all of these properties to match your app's design. If a property is not specified, the SDK will use its default values.