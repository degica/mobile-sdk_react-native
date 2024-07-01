
# Komoju Payment Gateway SDK for React Native

**Welcome to the Komoju Payment Gateway SDK!** This SDK empowers you to seamlessly integrate secure payment processing into your React Native applications using the powerful Typescript language.

- *This will guide you to setup the sdk on local environment. In near future you will be able to install it from the npm registry.*

## Getting Started
First needs to set up the React Native on local environment.
[React Native Offical Guide](https://reactnative.dev/docs/environment-setup)




## Run Locally

Clone the project

```bash
  git clone https://github.com/degica/mobile-sdk_react-native.git
```

Go to the project directory

```bash
  cd mobile-sdk_react-native
```

Install dependencies on SDK

```bash
  cd payment_sdk 
  yarn install
```

Install dependencies on Example App

```bash
  cd example 
  yarn install
```

Adding the evironmental variables on the example app

```bash
  cd example
  touch .env
```

There are two environment variables need to add to the .env
- *SECRET_KEY={key should get from the komoju dashboard}*
- *PUBLIC_KEY={key should get from the komoju dashboard}*

Start the Example App

Based on the platform
use either 
```bash
  cd example
  yarn android
```
on android 
or 
```bash
  cd example
  yarn ios
```
on the IOS.
