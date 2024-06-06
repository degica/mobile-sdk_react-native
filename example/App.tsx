import React from 'react';
import {KomojuSDK} from 'react-native-komoju';
import {PUBLIC_KEY} from '@env';

import Component from './component';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <KomojuSDK.KomojuProvider urlScheme="" publicKey={PUBLIC_KEY}>
        <Component />
      </KomojuSDK.KomojuProvider>
    </GestureHandlerRootView>
  );
}

export default App;
