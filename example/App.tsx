import React from 'react';
import {KomojuSDK} from 'react-native-komoju';
import {PUBLIC_KEY} from '@env';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PaymentScreen from './PaymentScreen';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <KomojuSDK.KomojuProvider urlScheme="" publicKey={PUBLIC_KEY}>
        <PaymentScreen />
      </KomojuSDK.KomojuProvider>
    </GestureHandlerRootView>
  );
}

export default App;
