import React from 'react';
import {KomojuSDK} from '@komoju/komoju-react-native';
import {PUBLIC_KEY} from '@env';

import PaymentScreen from './PaymentScreen';

function App(): React.JSX.Element {
  return (
    <KomojuSDK.KomojuProvider publicKey={PUBLIC_KEY}>
      <PaymentScreen />
    </KomojuSDK.KomojuProvider>
  );
}

export default App;
