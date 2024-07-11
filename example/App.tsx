import React from 'react';

import {KomojuSDK} from 'react-native-komoju';

import PaymentScreen from './PaymentScreen';

function App(): React.JSX.Element {
  return (
    <KomojuSDK.KomojuProvider publicKey="<PUBLIC_KEY>">
      <PaymentScreen />
    </KomojuSDK.KomojuProvider>
  );
}

export default App;
