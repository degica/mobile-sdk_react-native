import React from 'react';
import {KomojuSDK} from 'react-native-komoju';
import {PUBLIC_KEY} from '@env';

import Component from './component';

function App(): React.JSX.Element {
  return (
    <KomojuSDK.KomojuProvider urlScheme="" publicKey={PUBLIC_KEY}>
      <Component />
    </KomojuSDK.KomojuProvider>
  );
}

export default App;
