import React from 'react';
import {KomojuSDK} from '../payment_sdk/src';
import {PUBLIC_KEY} from '@env';
import 'react-native-svg';

import PaymentScreen from './PaymentScreen';

function App(): React.JSX.Element {
  return (
    <KomojuSDK.KomojuProvider urlScheme="" publicKey={PUBLIC_KEY}>
      <PaymentScreen />
    </KomojuSDK.KomojuProvider>
  );
}

export default App;
